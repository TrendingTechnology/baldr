/**
 * @module @bldr/cli/lib
 */

// Node packages.
const fs = require('fs')

// Project packages.
const mediaServer = require('@bldr/media-server')
const { writeYamlFile } = require('@bldr/media-manager')

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

module.exports = {
  filePathToAssetType,
  makeAsset,
}
