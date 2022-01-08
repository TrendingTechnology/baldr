import fs from 'fs'
import path from 'path'
import childProcess from 'child_process'

// Project packages.
import { getExtension, referencify, asciify } from '@bldr/string-format'
import {
  walk,
  operations,
  buildMinimalAssetData,
  locationIndicator
} from '@bldr/media-manager'
import { categoriesManagement } from '@bldr/media-categories'
import { readFile, writeFile, writeYamlFile } from '@bldr/file-reader-writer'
import { MediaDataTypes } from '@bldr/type-definitions'
import * as log from '@bldr/log'

interface Options {
  regexp?: string
  extension?: string
  copy?: boolean
  dryRun?: boolean
}

/**
 * Relocate a media asset inside the main media folder. Move some
 * media assets into two letter folders.
 */
function relocate (oldPath: string, extension: string, cmdObj: Options): void {
  if (oldPath.match(/^.*\/[A-Z]{2,}\/[^/]*$/) != null) {
    return
  }
  let twoLetterFolder = ''
  if (oldPath.match(/.*Arbeitsblatt_Loesung.*/) != null) {
    twoLetterFolder = 'TX'
  } else if (extension === 'jpg') {
    twoLetterFolder = 'BD'
  } else if (extension === 'mp4') {
    twoLetterFolder = 'VD'
  } else if (['svg', 'eps', 'png', 'mscx'].includes(extension)) {
    twoLetterFolder = 'NB'
  } else if (extension === 'm4a') {
    twoLetterFolder = 'HB'
  } else if (extension === 'tex') {
    twoLetterFolder = 'TX'
  }
  const parentDir = locationIndicator.getPresParentDir(oldPath)
  if (parentDir == null) {
    throw new Error(`${oldPath} is not a presentation folder ${oldPath}.`)
  }
  const newPath = path.join(parentDir, twoLetterFolder, path.basename(oldPath))
  if (oldPath !== newPath) {
    if (extension === 'tex') {
      const oldContent = readFile(oldPath)
      // \grafik{HB/Beethoven.jpg} -> \grafik{../HB/Beethoven.jpg}
      const newContent = oldContent.replace(/\{([A-Z]{2,})\//g, '{../$1/')
      if (oldContent !== newContent) {
        writeFile(oldPath, newContent)
      }
    }
    operations.moveAsset(oldPath, newPath, cmdObj)
  }
}

/**
 * For images in the TeX file which appear multiple times in one file.
 */
const resolvedTexImages: { [key: string]: string } = {}

/**
 * Move images which are linked in a Tex file.
 *
 * @param oldPathTex - for example:
 *   `/media/10/10_Jazz/30_Stile/50_Modern-Jazz/Arbeitsblatt.tex`
 * @param baseName - for example: `My-little-Annie-so-sweet`
 * @param cmdObj - See commander docs.
 *
 * @returns for example: BD/John-Coltrane.jpg
 */
function moveTexImage (
  oldPathTex: string,
  baseName: string,
  cmdObj: Options
): string | undefined {
  if (resolvedTexImages[baseName] != null) return resolvedTexImages[baseName]
  // /archive/10/10_Jazz/30_Stile/50_Modern-Jazz/Material
  const imageFolder = path.join(path.dirname(oldPathTex), 'Material')
  let ext
  let oldPath
  for (const extension of ['jpg', 'png', 'eps']) {
    const imagePath = path.join(imageFolder, `${baseName}.${extension}`)
    if (fs.existsSync(imagePath)) {
      oldPath = imagePath
      ext = extension
      break
    }
  }

  // /archive/10/10_Jazz/30_Stile/50_Modern-Jazz/Material/John-Coltrane.jpg
  if (oldPath != null) {
    // /archive/10/10_Jazz/30_Stile/50_Modern-Jazz
    const presParentDir = locationIndicator.getPresParentDir(oldPath)
    // /baldr/media/10/10_Jazz/30_Stile/50_Modern-Jazz
    if (presParentDir == null) {
      throw new Error(`${oldPath} is not a presentation folder ${oldPath}.`)
    }
    const presParentDirMirrored = locationIndicator.getMirroredPath(
      presParentDir
    )
    if (presParentDirMirrored === undefined) return

    let imgParentDir
    if (ext === 'png' || ext === 'eps') {
      imgParentDir = 'NB'
    } else {
      imgParentDir = 'BD'
    }
    // BD/John-Coltrane.jpg
    const newRelPath = path.join(imgParentDir, path.basename(oldPath))
    // /baldr/media/10/10_Jazz/30_Stile/50_Modern-Jazz/BD/John-Coltrane.jpg
    const newPath = path.join(presParentDirMirrored, newRelPath)
    operations.moveAsset(oldPath, newPath, cmdObj)
    resolvedTexImages[baseName] = newRelPath
    return newRelPath
  }
}

/**
 *
 * @param {String} oldPath - for example:
 *   `/archive/10/10_Jazz/30_Stile/50_Modern-Jazz/Arbeitsblatt.tex`
 * @param {Object} cmdObj - See commander docs.
 */
function moveTex (oldPath: string, newPath: string, cmdObj: Options): void {
  // /archive/10/10_Jazz/30_Stile/10_New-Orleans-Dixieland/Material/Texte.tex
  // /archive/10/10_Jazz/History-of-Jazz/Inhalt.tex
  if (locationIndicator.isInDeactivatedDir(oldPath)) return
  const content = readFile(oldPath)
  // \begin{grafikumlauf}{Inserat}
  // \grafik[0.8\linewidth]{Freight-Train-Blues}
  const matches = content.matchAll(
    /(\\grafik|\\begin\{grafikumlauf\}).*?\{(.+?)\}/g
  )
  // [
  //   [
  //     '\grafik[0.8\linewidth]{Freight-Train-Blues}',
  //     '\grafik[0.8\linewidth]{BD/Freight-Train-Blues.eps}'
  //   ]
  // ]
  const replacements = []
  for (const match of matches) {
    // \grafik[0.8\linewidth]{Freight-Train-Blues}
    // \grafik{My-little-Annie-so-sweet}
    const oldMarkup = match[0]
    // Freight-Train-Blues
    // My-little-Annie-so-sweet
    const oldRelPath = match[2]
    // BD/Count-Basie.jpg
    // NB/Sing-Sing-Sing_Partitur.png
    const newRelPath = moveTexImage(oldPath, oldRelPath, cmdObj)
    // TeX files are now in the TX subfolder
    // \grafik[0.8\linewidth]{../BD/Freight-Train-Blues.eps}
    if (newRelPath != null) {
      const newMarkup = oldMarkup.replace(oldRelPath, `../${newRelPath}`)
      replacements.push([oldMarkup, newMarkup])
    }
  }

  // /var/data/baldr/media/10/10_Jazz/30_Stile/50_Modern-Jazz/TX/Arbeitsblatt.tex
  newPath = locationIndicator.moveIntoSubdir(newPath, 'TX')
  operations.moveAsset(oldPath, newPath, cmdObj)
  // Maybe --dry-run is specified
  if (fs.existsSync(newPath)) {
    let newContent = readFile(newPath)
    for (const replacement of replacements) {
      newContent = newContent.replace(replacement[0], replacement[1])
    }
    writeFile(newPath, newContent)
  }
}

function getMbrainzRecordingId (filePath: string): string | undefined {
  const process = childProcess.spawnSync(
    '/usr/local/bin/musicbrainz-acoustid.py',
    [filePath],
    { encoding: 'utf-8' }
  )

  if (process.stdout != null) {
    // There are mulitple recording ids:
    // 0585ec4a-487d-4944-bf59-dd9ecc325c66\n
    // 065bda42-e077-4cf0-b458-4c0e455f09fe\n
    const musicbrainzRecordingId = process.stdout.replace(/\n.*$/s, '')
    log.error(musicbrainzRecordingId)
    return musicbrainzRecordingId
  }
}

async function moveMp3 (
  oldPath: string,
  newPath: string,
  cmdObj: Options
): Promise<void> {
  // Format dest file path.
  newPath = locationIndicator.moveIntoSubdir(newPath, 'HB')
  newPath = asciify(newPath)
  // a Earth, Wind & Fire - Shining Star.mp3
  let fileName = path.basename(newPath)
  fileName = fileName.replace(/\.mp3$/i, '')
  fileName = referencify(fileName)
  fileName = `${fileName}.mp3`
  // a-Fletcher-Henderson_Aint-she-sweet.mp3
  fileName = fileName.replace(/^a-/, '')
  const tmpMp3Path = path.join(path.dirname(newPath), fileName)

  // Move mp3 into media.
  operations.moveAsset(oldPath, tmpMp3Path, { copy: true })

  // Convert into m4a.
  const convertedPath = await operations.convertAsset(tmpMp3Path)
  if (convertedPath == null) throw new Error('Error converting asset.')

  const metaData = buildMinimalAssetData(convertedPath) as MediaDataTypes.AssetMetaData
  if (metaData == null) throw new Error('Error reading asset yaml')
  metaData.metaType = 'composition'

  // Try to get the MusicBrainz recording ID.
  const musicbrainzRecordingId = getMbrainzRecordingId(tmpMp3Path)
  if (musicbrainzRecordingId != null) {
    metaData.musicbrainzRecordingId = musicbrainzRecordingId
  }

  metaData.source = oldPath
  // To get ID prefix
  metaData.filePath = newPath
  const result = categoriesManagement.process(metaData)
  writeYamlFile(`${newPath}.yml`, result)

  // Delete MP3.
  fs.unlinkSync(tmpMp3Path)
}

/**
 * @param oldPath - for example:
 *   `/archive/10/10_Jazz/30_Stile/50_Modern-Jazz/Arbeitsblatt.tex`
 * @param cmdObj - See commander docs.
 */
async function moveReference (oldPath: string, cmdObj: Options): Promise<void> {
  let newPath = locationIndicator.getMirroredPath(oldPath)
  if (newPath === undefined) return
  newPath = locationIndicator.moveIntoSubdir(newPath, 'QL')
  operations.moveAsset(oldPath, newPath, cmdObj)
  if (cmdObj.dryRun != null && cmdObj.dryRun) return
  await operations.initializeMetaYaml(newPath)
  const metaData = buildMinimalAssetData(newPath)
  if (metaData == null) return
  metaData.reference_title =
    'Tonart: Musik erleben - reflektieren - interpretieren; Lehrwerk für die Oberstufe.'
  metaData.author = 'Wieland Schmid'
  metaData.publisher = 'Helbling'
  metaData.release_data = 2009
  metaData.edition = 1
  metaData.isbn = '978-3-85061-460-3'
  writeYamlFile(`${newPath}.yml`, metaData)
}

/**
 * @param oldPath - for example:
 *   `/archive/10/10_Jazz/30_Stile/50_Modern-Jazz/Arbeitsblatt.tex`
 * @param extension - The extension of the file.
 * @param cmdObj - See commander docs.
 */
async function moveFromArchive (
  oldPath: string,
  extension: string,
  cmdObj: Options
): Promise<void> {
  if (oldPath.includes('Tonart.pdf')) {
    await moveReference(oldPath, cmdObj)
    return
  }
  if (locationIndicator.isInDeactivatedDir(oldPath)) return
  const newPath = locationIndicator.getMirroredPath(oldPath)
  if (newPath === undefined) return
  log.info('%s -> %s', [oldPath, newPath])
  if (extension === 'tex') {
    moveTex(oldPath, newPath, cmdObj)
  } else if (extension === 'mp3') {
    await moveMp3(oldPath, newPath, cmdObj)
  } else {
    operations.moveAsset(oldPath, newPath, cmdObj)
  }
}

/**
 * @param oldPath - for example:
 *   `/archive/10/10_Jazz/30_Stile/50_Modern-Jazz/Arbeitsblatt.tex`
 * @param cmdObj - See commander docs.
 */
async function move (oldPath: string, cmdObj: Options): Promise<void> {
  // Had to be an absolute path (to check if its an inactive/archived folder)
  oldPath = path.resolve(oldPath)
  const extension = getExtension(oldPath)
  if (extension == null) return
  if (!locationIndicator.isInArchive(oldPath)) {
    relocate(oldPath, extension, cmdObj)
  } else {
    await moveFromArchive(oldPath, extension, cmdObj)
  }
}

/**
 * Normalize the metadata files in the YAML format (sort, clean up).
 *
 * @param filePaths - An array of input files. This parameter comes from
 *   the commanders’ variadic parameter `[files...]`.
 * @param cmdObj - An object containing options as key-value pairs.
 *  This parameter comes from `commander.Command.opts()`
 */
export default async function action (filePaths: string[], cmdObj: Options): Promise<void> {
  const opts: { [key: string]: any } = {
    path: filePaths,
    payload: cmdObj
  }
  if (cmdObj.extension != null) {
    opts.regex = cmdObj.extension
    await walk(move, opts)
  } else if (cmdObj.regexp != null) {
    opts.regex = new RegExp(cmdObj.regexp)
    await walk(move, opts)
  } else {
    await walk(
      {
        async everyFile (relPath) {
          await move(relPath, {})
        }
      },
      opts
    )
  }
}
