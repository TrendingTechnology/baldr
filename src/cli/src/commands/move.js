// Third party packages.
const chalk = require('chalk')

// Project packages.
const mediaServer = require('@bldr/api-media-server')
const lib = require('../lib.js')

function move(oldPath, copy) {
  const newPath = mediaServer.basePaths.getMirroredPath(oldPath)
  console.log(`${chalk.yellow(oldPath)} -> ${chalk.green(newPath)}`)
  lib.renameAsset(oldPath, newPath, copy)
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
