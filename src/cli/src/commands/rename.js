// Node packages.
const path = require('path')

// Project packages.
const mediaServer = require('@bldr/api-media-server')
const lib = require('../lib.js')

// Globals.
const { cwd } = require('../main.js')

/**
 * @param {String} oldPath - The media file path.
 *
 * @returns {String}
 */
function renameOneFile (oldPath) {
  let newPath = mediaServer.asciify(oldPath)
  const basename = path.basename(newPath)
  // Remove a- and v- prefixes
  const cleanedBasename = basename.replace(/^[va]-/g, '')
  if (cleanedBasename !== basename) {
    newPath = path.join(path.dirname(newPath), cleanedBasename)
  }
  lib.renameAsset(oldPath, newPath)
  return newPath
}

/**
 * Rename all child files in the current working directory.
 */
function action () {
  mediaServer.walk(cwd, {
    all (oldPath) {
      renameOneFile(oldPath)
    }
  })
}

module.exports = {
  command: 'rename',
  alias: 'r',
  description: [
    'Rename and clean file names, remove all whitespaces and special characters.',
    'For example:',
    '“Heimat Games - Titelmusik.mp3” -> “Heimat-Games_Titelmusik.mp3”',
    '“Götterdämmerung.mp3” -> “Goetterdaemmerung.mp3”'
  ].join(' '),
  action,
  renameOneFile
}
