/**
 * @module @bldr/cli/lib
 */

// Node packages.
const fs = require('fs')

// Third party packages.
const yaml = require('js-yaml')

// Project packages.
const mediaServer = require('@bldr/media-server')
const { getExtension, convertPropertiesCase } = require('@bldr/core-browser')
const { readFile, writeYamlFile } = require('@bldr/media-manager')

/**
 * TODO: Remove and use version in @bldr/media-manager.
 *
 * @param {String} mediaFile
 *
 * @returns {module:@bldr/media-server~Asset}
 */
function makeAsset (mediaFile) {
  return new mediaServer.Asset(mediaFile).addFileInfos()
}

/**
 * TODO: Remove and use version in @bldr/media-manager.
 *
 * @param {String} filePath
 *
 * @returns {String}
 */
function filePathToAssetType (filePath) {
  const asset = makeAsset(filePath)
  const inputExtension = asset.extension.toLowerCase()
  return mediaServer.assetTypes.extensionToType(inputExtension)
}

/**
 * TODO: Remove and use version in @bldr/media-manager.
 *
 * Write the metadata YAML file for a corresponding media file specified by
 * `filePath`.
 *
 * @param {String} filePath - The filePath gets asciified and a yml extension
 *   is appended.
 * @param {Object} metaData
 * @param {Boolean} force - Always create the yaml file. Overwrite the old one.
 */
function writeMetaDataYaml (filePath, metaData, force) {
  if (fs.lstatSync(filePath).isDirectory()) return
  const yamlFile = `${mediaServer.asciify(filePath)}.yml`
  if (
    force ||
    !fs.existsSync(yamlFile)
  ) {
    if (!metaData) metaData = {}
    const asset = new mediaServer.Asset(filePath).addFileInfos()
    if (!metaData.id) {
      metaData.id = asset.basename_
    }
    if (!metaData.title) {
      metaData.title = mediaServer.deasciify(asset.basename_)
    }

    metaData = mediaServer.metaTypes.process(metaData)
    writeYamlFile(yamlFile, metaData)
    return {
      filePath,
      yamlFile,
      metaData
    }
  }
  return {
    filePath,
    msg: 'No action.'
  }
}

module.exports = {
  filePathToAssetType,
  makeAsset,
  writeMetaDataYaml
}
