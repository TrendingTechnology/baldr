// Project packages.
const mediaServer = require('@bldr/media-server')
const lib = require('../../lib.js')
const { renameOneFile } = require('../rename/action.js')

/**
 * Write the metadata YAML file.
 *
 * @param {Array} files - An array of input files, comes from the commanders’
 *   variadic parameter `[files...]`.
 */
function action (files) {
  mediaServer.walk({
    asset (relPath) {
      const newPath = renameOneFile(relPath)
      console.log(newPath)

      const result = lib.writeMetaDataYaml(newPath)
      console.log(result)
    }
  }, {
    path: files
  })
}

module.exports = action
