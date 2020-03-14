// Project packages.
const mediaServer = require('@bldr/api-media-server')
const lib = require('../lib.js')
const { renameOneFile } = require('./rename.js')

/**
 * Write the metadata YAML file.
 *
 * @param {Array} files - An array of input files to convert.
 */
function action (files) {
  mediaServer.walk({
    asset (relPath) {
      lib.writeMetaDataYaml(renameOneFile(relPath))
    }
  }, {
    path: files
  })
}

module.exports = action
