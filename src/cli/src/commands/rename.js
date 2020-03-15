// Node packages.
const path = require('path')

// Project packages.
const mediaServer = require('@bldr/api-media-server')
const lib = require('../lib.js')

/**
 * Rename one file.
 *
 * @param {String} oldPath - The media file path.
 *
 * @returns {String} - The new file name.
 */
function renameOneFile (oldPath) {
  let newPath = mediaServer.asciify(oldPath)
  const basename = path.basename(newPath)
  // Remove a- and v- prefixes
  const cleanedBasename = basename.replace(/^[va]-/g, '')
  if (cleanedBasename !== basename) {
    newPath = path.join(path.dirname(newPath), cleanedBasename)
  }
  lib.moveAsset(oldPath, newPath)
  return newPath
}

/**
 * Rename files.
 *
 * @param {Array} files - An array of input files, comes from the commanders’
 *   variadic parameter `[files...]`.
 */
function action (files) {
  mediaServer.walk({
    all (oldPath) {
      renameOneFile(oldPath)
    }
  }, {
    path: files
  })
}

module.exports = {
  action,
  renameOneFile
}
