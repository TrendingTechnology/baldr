// Project packages.
const mediaServer = require('@bldr/media-server')
const { normalizeOneFile } = require('../normalize/action.js')
const { writeMetaDataYaml, renameMediaAsset } = require('@bldr/media-manager')

/**
 * @param {String} filePath
 * @param {Object} metaData
 */
async function createYamlOneFile (filePath, metaData) {
  const newPath = renameMediaAsset(filePath)
  writeMetaDataYaml(newPath, metaData)
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
      const newPath = renameMediaAsset(relPath)
      console.log(newPath)
      writeMetaDataYaml(newPath)
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
