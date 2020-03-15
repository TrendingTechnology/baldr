// Third party packages.
const fs = require('fs')
const path = require('path')

// Third party packages.
const chalk = require('chalk')

// Project packages.
const mediaServer = require('@bldr/api-media-server')
const coreBrowser = require('@bldr/core-browser')
const lib = require('../lib.js')

const basePaths = mediaServer.basePaths

/**
 * `/baldr/media/10/10_Jazz/30_Stile/20_Swing/Material/Duke-Ellington.jpg` ->
 * `/baldr/media/10/10_Jazz/30_Stile/20_Swing`
 *
 * @param {String} filePath
 */
function getPresParentDir (filePath) {
  // /Duke-Ellington.jpg
  // /Material
  const regexp = new RegExp(path.sep +'([^' + path.sep + ']+)$')
  let match
  do {
    let isPrefixed
    match = filePath.match(regexp)
    if (match && match.length > 1) {
      // 20_Swing -> true
      // Material -> false
      isPrefixed = match[1].match(/\d\d_.*/g)
      if (!isPrefixed) {
        filePath = filePath.replace(regexp, '')
      }
    }
    if (isPrefixed) match = false
  } while (match)
  return filePath
}

/**
 * @param {String} oldPathTex - for example:
 *   `/media/10/10_Jazz/30_Stile/50_Modern-Jazz/Arbeitsblatt.tex`
 * @param {String} baseName - for example: `My-little-Annie-so-sweet`
 * @param {Object} cmdObj - See commander docs.
 */
function moveTexImage (oldPathTex, baseName, cmdObj) {
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
    const presParentDir = getPresParentDir(oldPath)
    // /baldr/media/10/10_Jazz/30_Stile/50_Modern-Jazz
    const presParentDirMirrored = basePaths.getMirroredPath(presParentDir)
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
    // \grafik[0.8\linewidth]{BD/Freight-Train-Blues.eps}
    const newMarkup = oldMarkup.replace(oldRelPath, newRelPath)
    replacements.push([oldMarkup, newMarkup])
  }

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

/**
 * @param {String} oldPath - for example:
 *   `/archive/10/10_Jazz/30_Stile/50_Modern-Jazz/Arbeitsblatt.tex`
 * @param {Object} cmdObj - See commander docs.
 */
function move(oldPath, cmdObj) {
  const newPath = basePaths.getMirroredPath(oldPath)
  console.log(`${chalk.yellow(oldPath)} -> ${chalk.green(newPath)}`)
  const extension = coreBrowser.getExtension(oldPath)
  if (extension === 'tex') {
    moveTex(oldPath, newPath, cmdObj)
  } else {
    lib.moveAsset(oldPath, newPath, cmdObj)
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
      all (relPath) {
        move(relPath)
      }}, opts
    )
  }
}

module.exports = action
