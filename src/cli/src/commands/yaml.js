// Project packages.
const mediaServer = require('@bldr/api-media-server')
const lib = require('../lib.js')
const { renameOneFile } = require('./rename.js')

// Globals.
const { cwd } = require('../main.js')

/**
 * @param {String} filePath
 */
function action (filePath) {
  if (filePath) {
    lib.writeMetaDataYaml(renameOneFile(filePath))
  } else {
    mediaServer.walk(cwd, {
      asset (relPath) {
        lib.writeMetaDataYaml(renameOneFile(relPath))
      }
    })
  }
}

module.exports = {
  command: 'yaml [input]',
  alias: 'y',
  description: 'Create info files in the YAML format in the current working directory.',
  action
}
