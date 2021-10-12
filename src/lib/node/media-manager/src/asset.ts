import path from 'path'
import fs from 'fs'

import { getExtension, asciify } from '@bldr/core-browser'
import { categoriesManagement } from '@bldr/media-categories'
import { MediaResolverTypes, GenericError } from '@bldr/type-definitions'
import { readYamlFile } from '@bldr/file-reader-writer'
import { readYamlMetaData } from './main'
import { locationIndicator } from './location-indicator'
import * as log from '@bldr/log'

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
      log.debug('Copy file from %s to %s', oldPath, newPath)
      fs.copyFileSync(oldPath, newPath)
    }
  } else {
    if (!(dryRun != null && dryRun)) {
      //  Error: EXDEV: cross-device link not permitted,
      try {
        log.debug('Move file from %s to %s', oldPath, newPath)
        fs.renameSync(oldPath, newPath)
      } catch (error) {
        const e = error as GenericError
        if (e.code === 'EXDEV') {
          log.debug(
            'Move file by copying and deleting from %s to %s',
            oldPath,
            newPath
          )
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
      log.debug('Move corresponding file from %s to %s', oldCorrespondingPath, newCorrespondingPath)
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
 * Read the corresponding YAML file of a media asset.
 *
 * @param filePath - The path of the media asset (without the
 *   extension `.yml`).
 */
export function readAssetYaml (
  filePath: string
): MediaResolverTypes.YamlFormat | undefined {
  const extension = getExtension(filePath)
  if (extension !== 'yml') {
    filePath = `${filePath}.yml`
  }
  if (fs.existsSync(filePath)) {
    return readYamlFile(filePath) as MediaResolverTypes.YamlFormat
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
  const metaData = readAssetYaml(oldPath)
  let newPath
  if (metaData?.categories != null) {
    metaData.extension = getExtension(oldPath)
    metaData.filePath = oldPath
    const data = metaData
    newPath = categoriesManagement.formatFilePath(data, oldPath)
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
    log.error(error)
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
    log.info(
      'Rename the file %s by reference from %s to %s',
      filePath,
      oldBaseName,
      ref
    )
    newPath = path.join(path.dirname(oldPath), `${ref}${extension}`)
    moveAsset(oldPath, newPath)
  }
}
