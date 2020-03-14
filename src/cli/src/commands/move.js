// Third party packages.
const chalk = require('chalk')

// Project packages.
const mediaServer = require('@bldr/api-media-server')
const coreBrowser = require('@bldr/core-browser')
const lib = require('../lib.js')

function move(oldPath, copy) {
  const newPath = mediaServer.basePaths.getMirroredPath(oldPath)
  console.log(`${chalk.yellow(oldPath)} -> ${chalk.green(newPath)}`)
  const extension = coreBrowser.getExtension(oldPath)
  if (extension === 'tex') {
    const content = lib.readFile(oldPath)
    const matches = content.matchAll(/\\grafik.*?\{(.+?)\}/g)
    for (const match of matches) {
      console.log(match[1])
    }
  }
  //lib.renameAsset(oldPath, newPath, copy)
}

function action (files, cmdObj) {
  if (cmdObj.extension) {
    mediaServer.walk(move, {
      path: files,
      regex: cmdObj.extension
    })
  } else {
    mediaServer.walk({
      all (relPath) {
        move(relPath)
      }}, {path: files }
    )
  }
}

module.exports = action
