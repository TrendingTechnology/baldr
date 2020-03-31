// Third party packages.
const fs = require('fs')
const path = require('path')
const childProcess = require('child_process')

// Third party packages.
const chalk = require('chalk')

// Project packages.
const mediaServer = require('@bldr/media-server')
const coreBrowser = require('@bldr/core-browser')
const lib = require('../../lib.js')

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
      const oldContent = lib.readFile(oldPath)
      // \grafik{HB/Beethoven.jpg} -> \grafik{../HB/Beethoven.jpg}
      const newContent = oldContent.replace(/\{([A-Z]{2,})\//g, '{../$1/')
      if (oldContent !== newContent) {
        lib.writeFile(oldPath, newContent)
      }
    }
    lib.moveAsset(oldPath, newPath, cmdObj)
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
    lib.moveAsset(oldPath, newPath, cmdObj)
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
  const content = lib.readFile(oldPath)
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
  newPath = path.join(
    path.dirname(newPath),
    'TX',
    path.basename(newPath)
  )
  lib.moveAsset(oldPath, newPath, cmdObj)
  // Maybe --dry-run is specified
  if (fs.existsSync(newPath)) {
    let newContent = lib.readFile(newPath)
    for (const replacement of replacements) {
      newContent = newContent.replace(replacement[0], replacement[1])
    }
    lib.writeFile(newPath, newContent)
  }
}

function moveMp3 (oldPath, newPath, cmdObj) {
  const process = childProcess.spawnSync(
    '/usr/local/bin/musicbrainz-acoustid.py', [oldPath], { encoding: 'utf-8' }
  )

  if (process.stdout) {
    // There are mulitple recording ids:
    // 0585ec4a-487d-4944-bf59-dd9ecc325c66\n
    // 065bda42-e077-4cf0-b458-4c0e455f09fe\n
    const musicbrainzRecordingId = process.stdout.replace(/\n.*$/s, '')
    console.log(chalk.red(musicbrainzRecordingId))
  }

}

function moveFromArchive (oldPath, extension, cmdObj) {
  if (locationIndicator.isInDeactivatedDir(oldPath)) return
  const newPath = locationIndicator.getMirroredPath(oldPath)
  console.log(`${chalk.yellow(oldPath)} -> ${chalk.green(newPath)}`)
  if (extension === 'tex') {
    moveTex(oldPath, newPath, cmdObj)
  } else if (extension === 'mp3') {
    moveMp3(oldPath, newPath, cmdObj)
  } else {
    lib.moveAsset(oldPath, newPath, cmdObj)
  }
}

/**
 * @param {String} oldPath - for example:
 *   `/archive/10/10_Jazz/30_Stile/50_Modern-Jazz/Arbeitsblatt.tex`
 * @param {Object} cmdObj - See commander docs.
 */
function move(oldPath, cmdObj) {
  // Had to be an absolute path (to check if its an inactive/archived folder)
  oldPath = path.resolve(oldPath)
  const extension = coreBrowser.getExtension(oldPath)
  if (!locationIndicator.isInArchive(oldPath)) {
    relocate(oldPath, extension, cmdObj)
  } else {
    moveFromArchive(oldPath, extension, cmdObj)
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
  } else {
    mediaServer.walk({
      everyFile (relPath) {
        move(relPath)
      }}, opts
    )
  }
}

module.exports = action
