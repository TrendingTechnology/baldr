// Node packages.
import childProcess from 'child_process'
import path from 'path'
import fs from 'fs'

// Project packages.
import { mimeTypeManager } from '@bldr/client-media-models'
import { referencify, asciify, deepCopy, msleep } from '@bldr/core-browser'
import { getExtension } from '@bldr/string-format'
import { collectAudioMetadata } from '@bldr/audio-metadata'
import { categoriesManagement, categories } from '@bldr/media-categories'
import { writeYamlFile } from '@bldr/file-reader-writer'
import * as log from '@bldr/log'
import wikidata from '@bldr/wikidata'
import {
  MediaResolverTypes,
  GenericError,
  MediaCategoriesTypes,
  StringIndexedObject
} from '@bldr/type-definitions'
import { convertToYaml } from '@bldr/yaml'
import { buildMinimalAssetData } from '@bldr/media-data-collector'

import { locationIndicator } from './location-indicator'
import { readYamlMetaData } from './main'
import { writeYamlMetaData } from './yaml'

interface MoveAssetConfiguration {
  copy?: boolean
  dryRun?: boolean
}

function move (
  oldPath: string,
  newPath: string,
  { copy, dryRun }: MoveAssetConfiguration
): void {
  if (oldPath === newPath) {
    return
  }
  if (copy != null && copy) {
    if (!(dryRun != null && dryRun)) {
      log.debug('Copy file from %s to %s', [oldPath, newPath])
      fs.copyFileSync(oldPath, newPath)
    }
  } else {
    if (!(dryRun != null && dryRun)) {
      //  Error: EXDEV: cross-device link not permitted,
      try {
        log.debug('Move file from %s to %s', [oldPath, newPath])
        fs.renameSync(oldPath, newPath)
      } catch (error) {
        const e = error as GenericError
        if (e.code === 'EXDEV') {
          log.debug('Move file by copying and deleting from %s to %s', [
            oldPath,
            newPath
          ])
          fs.copyFileSync(oldPath, newPath)
          fs.unlinkSync(oldPath)
        }
      }
    }
  }
}

/**
 *
 * @param oldParentPath - The old path of the parent media file.
 * @param newParentPath - The new path of the parent media file.
 * @param search - A regular expression the search for a substring that gets replaced by the replaces.
 * @param replaces - An array of replace strings.
 * @param opts
 */
function moveCorrespondingFiles (
  oldParentPath: string,
  newParentPath: string,
  search: RegExp,
  replaces: string[],
  opts: MoveAssetConfiguration
): void {
  for (const replace of replaces) {
    const oldCorrespondingPath = oldParentPath.replace(search, replace)
    if (fs.existsSync(oldCorrespondingPath)) {
      const newCorrespondingPath = newParentPath.replace(search, replace)
      log.debug('Move corresponding file from %s to %s', [
        oldCorrespondingPath,
        newCorrespondingPath
      ])
      move(oldCorrespondingPath, newCorrespondingPath, opts)
    }
  }
}

/**
 * Move (rename) or copy a media asset and it’s corresponding meta data file
 * (`*.yml`) and preview file (`_preview.jpg`).
 *
 * @param oldPath - The old path of a media asset.
 * @param newPath - The new path of a media asset.
 * @param opts - Some options
 *
 * @returns The new path.
 */
export function moveAsset (
  oldPath: string,
  newPath: string,
  opts: MoveAssetConfiguration = {}
): string | undefined {
  if (newPath != null && oldPath !== newPath) {
    if (!(opts.dryRun != null && opts.dryRun)) {
      fs.mkdirSync(path.dirname(newPath), { recursive: true })
    }

    const extension = getExtension(oldPath)
    if (extension === 'eps' || extension === 'svg') {
      // Dippermouth-Blues.eps
      // Dippermouth-Blues.mscx
      // Dippermouth-Blues-eps-converted-to.pdf
      moveCorrespondingFiles(
        oldPath,
        newPath,
        /\.(eps|svg)$/,
        ['.mscx', '-eps-converted-to.pdf', '.eps', '.svg'],
        opts
      )
    }

    // Beethoven.mp4
    // Beethoven.mp4.yml
    // Beethoven.mp4_preview.jpg
    // Beethoven.mp4_waveform.png
    for (const suffix of ['.yml', '_preview.jpg', '_waveform.png']) {
      if (fs.existsSync(`${oldPath}${suffix}`)) {
        move(`${oldPath}${suffix}`, `${newPath}${suffix}`, opts)
      }
    }
    move(oldPath, newPath, opts)
    return newPath
  }
}

/**
 * Rename a media asset and its meta data files.
 *
 * @param oldPath - The media file path.
 *
 * @returns The new file name.
 */
export function renameMediaAsset (oldPath: string): string {
  let metaData
  if (fs.existsSync(`${oldPath}.yml`)) {
    metaData = buildMinimalAssetData(oldPath)
  }
  let newPath
  if (metaData?.categories != null) {
    metaData.extension = getExtension(oldPath)
    metaData.filePath = oldPath
    const d = metaData as unknown
    newPath = categoriesManagement.formatFilePath(
      d as MediaResolverTypes.YamlFormat,
      oldPath
    )
  }

  if (newPath == null) {
    newPath = asciify(oldPath)
  }
  const basename = path.basename(newPath)
  // Remove a- and v- prefixes
  const cleanedBasename = basename.replace(/^[va]-/g, '')
  if (cleanedBasename !== basename) {
    newPath = path.join(path.dirname(newPath), cleanedBasename)
  }
  moveAsset(oldPath, newPath)
  return newPath
}

/**
 * Rename a media asset after the `ref` (reference) property in the metadata file.
 *
 * @param filePath - The media asset file path.
 */
export function renameByRef (filePath: string): void {
  let result: { [key: string]: any }
  try {
    result = readYamlMetaData(filePath)
  } catch (error) {
    log.errorAny(error)
    return
  }

  if (result.ref != null) {
    let ref: string = result.ref
    const oldPath = filePath

    const refs = locationIndicator.getRefOfSegments(filePath)

    // 10_Ausstellung-Ueberblick/NB/01_Gnom.svg.yml
    // ref: Ausstellung-Ueberblick_NB_01_Gnom
    // -> 01_Gnom

    // 10_Ausstellung-Ueberblick/YT/sPg1qlLjUVQ.mp4.yml
    // ref: YT_sPg1qlLjUVQ
    // -> sPg1qlLjUVQ
    if (refs != null) {
      for (const pathRef of refs) {
        ref = ref.replace(new RegExp(`^${pathRef}_`), '')
      }
    }

    // Old approach:
    // ref = ref.replace(new RegExp('.*_' + getTwoLetterRegExp() + '_'), '')

    // .mp4
    const extension = path.extname(oldPath)
    const oldBaseName = path.basename(oldPath, extension)
    let newPath = null
    if (ref === oldBaseName) {
      return
    }
    log.info('Rename the file %s by reference from %s to %s', [
      filePath,
      oldBaseName,
      ref
    ])
    newPath = path.join(path.dirname(oldPath), `${ref}${extension}`)
    moveAsset(oldPath, newPath)
  }
}

async function queryWikidata (
  metaData: MediaResolverTypes.YamlFormat,
  categoryNames: MediaCategoriesTypes.Names,
  categoryCollection: MediaCategoriesTypes.Collection
): Promise<MediaResolverTypes.YamlFormat> {
  const dataWiki = await wikidata.query(
    metaData.wikidata,
    categoryNames,
    categoryCollection
  )
  log.verboseAny(dataWiki)
  metaData = wikidata.mergeData(
    metaData,
    dataWiki,
    categoryCollection
  ) as MediaResolverTypes.YamlFormat
  // To avoid blocking
  // url: 'https://www.wikidata.org/w/api.php?action=wbgetentities&ids=Q16276296&format=json&languages=en%7Cde&props=labels',
  // status: 429,
  // statusText: 'Scripted requests from your IP have been blocked, please
  // contact noc@wikimedia.org, and see also https://meta.wikimedia.org/wiki/User-Agent_policy',
  msleep(3000)
  return metaData
}

interface NormalizeMediaAssetOption {
  wikidata?: boolean
}

function logDiff (oldYamlMarkup: string, newYamlMarkup: string): void {
  log.verbose(log.colorizeDiff(oldYamlMarkup, newYamlMarkup))
}

/**
 * Normalize a media asset file.
 *
 * @param filePath - The media asset file path.
 */
export async function normalizeMediaAsset (
  filePath: string,
  options?: NormalizeMediaAssetOption
): Promise<void> {
  try {
    const yamlFile = `${filePath}.yml`
    const raw = buildMinimalAssetData(filePath)
    if (raw != null) {
      raw.filePath = filePath
    }
    let metaData = raw as MediaResolverTypes.YamlFormat
    if (metaData == null) {
      return
    }
    const origData = deepCopy(metaData) as MediaResolverTypes.YamlFormat

    // Always: general
    const categoryNames = categoriesManagement.detectCategoryByPath(filePath)
    if (categoryNames != null) {
      const categories = metaData.categories != null ? metaData.categories : ''
      metaData.categories = categoriesManagement.mergeNames(
        categories,
        categoryNames
      )
    }
    if (options?.wikidata != null) {
      if (metaData.wikidata != null && metaData.categories != null) {
        metaData = await queryWikidata(
          metaData,
          metaData.categories,
          categories
        )
      }
    }
    const newMetaData = await categoriesManagement.process(metaData, filePath)
    const oldMetaData = origData as StringIndexedObject
    delete oldMetaData.filePath

    const oldYamlMarkup = convertToYaml(oldMetaData)
    const newYamlMarkup = convertToYaml(newMetaData)
    if (oldYamlMarkup !== newYamlMarkup) {
      logDiff(oldYamlMarkup, newYamlMarkup)
      writeYamlFile(yamlFile, newMetaData)
    }
  } catch (error) {
    log.error(filePath)
    log.errorAny(error)
    process.exit()
  }
}

/**
 * Rename, create metadata yaml and normalize the metadata file.
 */
export async function initializeMetaYaml (
  filePath: string,
  metaData?: MediaResolverTypes.YamlFormat
): Promise<void> {
  const newPath = renameMediaAsset(filePath)
  await writeYamlMetaData(newPath, metaData)
  await normalizeMediaAsset(newPath, { wikidata: false })
}

/**
 * A set of output file paths. To avoid duplicate rendering by a second
 * run of the script.
 *
 * First run: `01 Hintergrund.MP3` -> `01-Hintergrund.m4a`
 *
 * Second run:
 * - not:
 *   1. `01 Hintergrund.MP3` -> `01-Hintergrund.m4a`
 *   2. `01-Hintergrund.m4a` -> `01-Hintergrund.m4a` (bad)
 * - but:
 *   1. `01 Hintergrund.MP3` -> `01-Hintergrund.m4a`
 */
const converted: Set<string> = new Set()

/**
 * Convert a media asset file.
 *
 * @param filePath - The path of the input file.
 * @param cmdObj - The command object from the commander.
 *
 * @returns The output file path.
 */
export async function convertAsset (
  filePath: string,
  cmdObj: { [key: string]: any } = {}
): Promise<string | undefined> {
  const asset = buildMinimalAssetData(filePath)

  if (asset.mimeType == null) {
    return
  }
  const outputExtension = mimeTypeManager.typeToTargetExtension(asset.mimeType)
  const outputFileName = `${referencify(asset.basename)}.${outputExtension}`
  let outputFile = path.join(path.dirname(filePath), outputFileName)
  if (converted.has(outputFile)) return

  let process: childProcess.SpawnSyncReturns<string> | undefined

  // audio
  // https://trac.ffmpeg.org/wiki/Encode/AAC

  // ffmpeg aac encoder
  // '-c:a', 'aac', '-b:a', '128k',

  // aac_he
  // '-c:a', 'libfdk_aac', '-profile:a', 'aac_he','-b:a', '64k',

  // aac_he_v2
  // '-c:a', 'libfdk_aac', '-profile:a', 'aac_he_v2'

  if (asset.mimeType === 'audio') {
    process = childProcess.spawnSync('ffmpeg', [
      '-i',
      filePath,
      // '-c:a', 'aac', '-b:a', '128k',
      // '-c:a', 'libfdk_aac', '-profile:a', 'aac_he', '-b:a', '64k',
      '-c:a',
      'libfdk_aac',
      '-vbr',
      '2',
      // '-c:a', 'libfdk_aac', '-profile:a', 'aac_he_v2',
      '-vn', // Disable video recording
      '-map_metadata',
      '-1', // remove metadata
      '-y', // Overwrite output files without asking
      outputFile
    ])

    // image
  } else if (asset.mimeType === 'image') {
    let size = '2000x2000>'
    if (cmdObj.previewImage != null) {
      outputFile = filePath.replace(`.${asset.extension}`, '_preview.jpg')
      size = '1000x1000>'
    }
    process = childProcess.spawnSync('magick', [
      'convert',
      filePath,
      '-resize',
      size, // http://www.imagemagick.org/Usage/resize/#shrink
      '-quality',
      '60', // https://imagemagick.org/script/command-line-options.php#quality
      outputFile
    ])

    // videos
  } else if (asset.mimeType === 'video') {
    process = childProcess.spawnSync('ffmpeg', [
      '-i',
      filePath,
      '-vcodec',
      'libx264',
      '-profile:v',
      'baseline',
      '-y', // Overwrite output files without asking
      outputFile
    ])
  }

  if (process != null) {
    if (process.status !== 0 && asset.mimeType === 'audio') {
      // A second attempt for mono audio: HEv2 only makes sense with stereo.
      // see http://www.ffmpeg-archive.org/stereo-downmix-error-aac-HEv2-td4664367.html
      process = childProcess.spawnSync('ffmpeg', [
        '-i',
        filePath,
        '-c:a',
        'libfdk_aac',
        '-profile:a',
        'aac_he',
        '-b:a',
        '64k',
        '-vn', // Disable video recording
        '-map_metadata',
        '-1', // remove metadata
        '-y', // Overwrite output files without asking
        outputFile
      ])
    }

    if (process.status === 0) {
      if (asset.mimeType === 'audio') {
        let metaData
        try {
          metaData = (await collectAudioMetadata(filePath)) as unknown
        } catch (error) {
          log.errorAny(error)
        }
        if (metaData != null) {
          await writeYamlMetaData(
            outputFile,
            metaData as MediaResolverTypes.YamlFormat
          )
        }
      }
      converted.add(outputFile)
    } else {
      log.error(process.stdout.toString())
      log.error(process.stderr.toString())
      throw new Error(`ConvertError: ${filePath} -> ${outputFile}`)
    }
  }
  return outputFile
}
