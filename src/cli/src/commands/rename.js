// Node packages.
const path = require('path')

// Project packages.
const {
  asciify,
  walk
} = require('@bldr/api-media-server')
const { renameAsset } = require('../lib.js')

// Globals.
const { cwd } = require('../main.js')

/**
 * @param {String} oldPath - The media file path.
 *
 * @returns {String}
 */
function renameOneFile (oldPath) {
  let newPath = asciify(oldPath)
  const basename = path.basename(newPath)
  // Remove a- and v- prefixes
  const cleanedBasename = basename.replace(/^[va]-/g, '')
  if (cleanedBasename !== basename) {
    newPath = path.join(path.dirname(newPath), cleanedBasename)
  }
  renameAsset(oldPath, newPath)
}

/**
 * Rename all child files in the current working directory.
 */
function action () {
  walk(cwd, {
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
  action
}
