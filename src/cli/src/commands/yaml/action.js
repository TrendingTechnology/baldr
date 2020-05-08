// Project packages.
const mediaServer = require('@bldr/media-server')
const lib = require('../../lib.js')
const { renameOneFile } = require('../rename/action.js')
const { normalizeOneFile } = require('../normalize/action.js')

/**
 * @param {String} filePath
 * @param {Object} metaData
 */
async function createYamlOneFile (filePath, metaData) {
  const newPath = renameOneFile(filePath)
  lib.writeMetaDataYaml(newPath, metaData)
  await normalizeOneFile(newPath, { wikidata: false })
}

/**
 * Create the metadata YAML files.
 *
 * @param {Array} files - An array of input files, comes from the commanders’
 *   variadic parameter `[files...]`.
 */
function action (files) {
  mediaServer.walk({
    async asset (relPath) {
      createYamlOneFile(relPath)
      const newPath = renameOneFile(relPath)
      console.log(newPath)
      lib.writeMetaDataYaml(newPath)
      await normalizeOneFile(newPath, { wikidata: false })
    }
  }, {
    path: files
  })
}

module.exports = {
  createYamlOneFile,
  action
}
