// Third party packages.
const fs = require('fs')
const path = require('path')
const childProcess = require('child_process')

// Third party packages.
const chalk = require('chalk')

// Project packages.
const mediaServer = require('@bldr/media-server')
const coreBrowser = require('@bldr/core-browser')
const {
  moveAsset,
  readFile,
  writeFile,
  writeYamlFile,
  readAssetYaml,
  operations
} = require('@bldr/media-manager')

const locationIndicator = mediaServer.locationIndicator

/**
 * Relocate a media asset inside the main media folder. Move some
 * media assets into two letter folders.
 *
 * @param {String} oldPath
 * @param {String} extension
 */
function relocate (oldPath, extension, cmdObj) {
  if (oldPath.match(new RegExp('^.*/[A-Z]{2,}/[^/]*$'))) {
    return
  }
  let twoLetterFolder = ''
  if (oldPath.match(/.*Arbeitsblatt_Loesung.*/)) {
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
    moveAsset(oldPath, newPath, cmdObj)
  }
}

/**
 * For images in the TeX file which appear multiple times in one file.
 */
const resolvedTexImages = {}

/**
 * Move images which are linked in a Tex file.
 *
 * @param {String} oldPathTex - for example:
 *   `/media/10/10_Jazz/30_Stile/50_Modern-Jazz/Arbeitsblatt.tex`
 * @param {String} baseName - for example: `My-little-Annie-so-sweet`
 * @param {Object} cmdObj - See commander docs.
 *
 * @returns {String} - for example: BD/John-Coltrane.jpg
 */
function moveTexImage (oldPathTex, baseName, cmdObj) {
  if (resolvedTexImages[baseName]) return resolvedTexImages[baseName]
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
  if (oldPath) {
    // /archive/10/10_Jazz/30_Stile/50_Modern-Jazz
    const presParentDir = locationIndicator.getPresParentDir(oldPath)
    // /baldr/media/10/10_Jazz/30_Stile/50_Modern-Jazz
    const presParentDirMirrored = locationIndicator.getMirroredPath(presParentDir)
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
    moveAsset(oldPath, newPath, cmdObj)
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
function moveTex (oldPath, newPath, cmdObj) {
  // /archive/10/10_Jazz/30_Stile/10_New-Orleans-Dixieland/Material/Texte.tex
  // /archive/10/10_Jazz/History-of-Jazz/Inhalt.tex
  if (locationIndicator.isInDeactivatedDir(oldPath)) return
  const content = readFile(oldPath)
  // \begin{grafikumlauf}{Inserat}
  // \grafik[0.8\linewidth]{Freight-Train-Blues}
  const matches = content.matchAll(/(\\grafik|\\begin\{grafikumlauf\}).*?\{(.+?)\}/g)
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
    const newMarkup = oldMarkup.replace(oldRelPath, `../${newRelPath}`)
    replacements.push([oldMarkup, newMarkup])
  }

  // /var/data/baldr/media/10/10_Jazz/30_Stile/50_Modern-Jazz/TX/Arbeitsblatt.tex
  newPath = locationIndicator.moveIntoSubdir(newPath, 'TX')
  moveAsset(oldPath, newPath, cmdObj)
  // Maybe --dry-run is specified
  if (fs.existsSync(newPath)) {
    let newContent = readFile(newPath)
    for (const replacement of replacements) {
      newContent = newContent.replace(replacement[0], replacement[1])
    }
    writeFile(newPath, newContent)
  }
}

function getMbrainzRecordingId (filePath) {
  const process = childProcess.spawnSync(
    '/usr/local/bin/musicbrainz-acoustid.py', [filePath], { encoding: 'utf-8' }
  )

  if (process.stdout) {
    // There are mulitple recording ids:
    // 0585ec4a-487d-4944-bf59-dd9ecc325c66\n
    // 065bda42-e077-4cf0-b458-4c0e455f09fe\n
    const musicbrainzRecordingId = process.stdout.replace(/\n.*$/s, '')
    console.log(chalk.red(musicbrainzRecordingId))
    return musicbrainzRecordingId
  }
}

async function moveMp3 (oldPath, newPath, cmdObj) {
  // Format dest file path.
  newPath = locationIndicator.moveIntoSubdir(newPath, 'HB')
  newPath = mediaServer.asciify(newPath)
  // a Earth, Wind & Fire - Shining Star.mp3
  let fileName = path.basename(newPath)
  fileName = fileName.replace(/\.mp3$/i, '')
  fileName = mediaServer.helper.idify(fileName)
  fileName = `${fileName}.mp3`
  // a-Fletcher-Henderson_Aint-she-sweet.mp3
  fileName = fileName.replace(/^a-/, '')
  const tmpMp3Path = path.join(path.dirname(newPath), fileName)

  // Move mp3 into media.
  moveAsset(oldPath, tmpMp3Path, { copy: true })

  // Convert into m4a.
  newPath = await operations.convertAsset(tmpMp3Path)

  let metaData = readAssetYaml(newPath)
  metaData.metaType = 'composition'

  // Try to get the MusicBrainz recording ID.
  const musicbrainzRecordingId = getMbrainzRecordingId(tmpMp3Path)
  if (musicbrainzRecordingId) metaData.musicbrainzRecordingId = musicbrainzRecordingId

  metaData.source = oldPath
  // To get ID prefix
  metaData.filePath = newPath
  metaData = mediaServer.metaTypes.process(metaData)
  writeYamlFile(`${newPath}.yml`, metaData)

  // Delete MP3.
  fs.unlinkSync(tmpMp3Path)
}

async function moveReference (oldPath, cmdObj) {
  let newPath = locationIndicator.getMirroredPath(oldPath)
  newPath = locationIndicator.moveIntoSubdir(newPath, 'QL')
  moveAsset(oldPath, newPath, cmdObj)
  if (cmdObj.dryRun) return
  await operations.initializeMetaYaml(newPath)
  const metaData = readAssetYaml(newPath)
  metaData.reference_title = 'Tonart: Musik erleben - reflektieren - interpretieren; Lehrwerk für die Oberstufe.'
  metaData.author = 'Wieland Schmid'
  metaData.publisher = 'Helbling'
  metaData.release_data = 2009
  metaData.edition = 1
  metaData.isbn = '978-3-85061-460-3'
  writeYamlFile(`${newPath}.yml`, metaData)
}

async function moveFromArchive (oldPath, extension, cmdObj) {
  if (oldPath.indexOf('Tonart.pdf') > -1) {
    await moveReference(oldPath, cmdObj)
    return
  }
  if (locationIndicator.isInDeactivatedDir(oldPath)) return
  let newPath = locationIndicator.getMirroredPath(oldPath)
  console.log(`${chalk.yellow(oldPath)} -> ${chalk.green(newPath)}`)
  if (extension === 'tex') {
    moveTex(oldPath, newPath, cmdObj)
  } else if (extension === 'mp3') {
    moveMp3(oldPath, newPath, cmdObj)
  } else {
    moveAsset(oldPath, newPath, cmdObj)
  }
}

/**
 * @param {String} oldPath - for example:
 *   `/archive/10/10_Jazz/30_Stile/50_Modern-Jazz/Arbeitsblatt.tex`
 * @param {Object} cmdObj - See commander docs.
 */
async function move (oldPath, cmdObj) {
  // Had to be an absolute path (to check if its an inactive/archived folder)
  oldPath = path.resolve(oldPath)
  const extension = coreBrowser.getExtension(oldPath)
  if (!locationIndicator.isInArchive(oldPath)) {
    relocate(oldPath, extension, cmdObj)
  } else {
    await moveFromArchive(oldPath, extension, cmdObj)
  }
}

function action (files, cmdObj) {
  const opts = {
    path: files,
    payload: cmdObj
  }
  if (cmdObj.extension) {
    opts.regex = cmdObj.extension
    mediaServer.walk(move, opts)
  } else if (cmdObj.regexp) {
    opts.regex = new RegExp(cmdObj.regexp)
    mediaServer.walk(move, opts)
  } else {
    mediaServer.walk({
      everyFile (relPath) {
        move(relPath, {})
      }
    }, opts)
  }
}

module.exports = action
