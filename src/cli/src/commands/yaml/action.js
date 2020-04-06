// Project packages.
const mediaServer = require('@bldr/media-server')
const lib = require('../../lib.js')
const { renameOneFile } = require('../rename/action.js')
const { normalizeOneFile } = require('../normalize/action.js')

/**
 * Create the metadata YAML files.
 *
 * @param {Array} files - An array of input files, comes from the commanders’
 *   variadic parameter `[files...]`.
 */
function action (files) {
  mediaServer.walk({
    async asset (relPath) {
      const newPath = renameOneFile(relPath)
      console.log(newPath)
      lib.writeMetaDataYaml(newPath)
      await normalizeOneFile(newPath, { wikidata: false })
    }
  }, {
    path: files
  })
}

module.exports = action
