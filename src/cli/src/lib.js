/**
 * @module @bldr/cli/lib
 */

// Node packages.
const fs = require('fs')

// Third party packages.
const yaml = require('js-yaml')


// Project packages.
const mediaServer = require('@bldr/media-server')
const { jsYamlConfig, getExtension, convertPropertiesCase } = require('@bldr/core-browser')

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
 * Read the corresponding YAML file of a media asset.
 *
 * @param {String} filePath - The path of the media asset (without the
 *   extension `.yml`).
 *
 * @returns {Object}
 */
function readAssetYaml (filePath) {
  const extension = getExtension(filePath)
  if (extension !== 'yml') filePath = `${filePath}.yml`
  if (fs.existsSync(filePath)) {
    let data = yaml.safeLoad(readFile(filePath))
    data = convertPropertiesCase(data, 'snake-to-camel')
    return data
  }
}

/**
 * TODO: Remove and use version in @bldr/media-manager.
 * Convert a Javascript object into a text string, ready to be written into
 * a text file.
 *
 * @param {Object} data - Some data to convert to YAML.
 *
 * @returns {String}
 */
function yamlToTxt (data) {
  data = convertPropertiesCase(data, 'camel-to-snake')
  const yamlMarkup = [
    '---',
    yaml.safeDump(data, jsYamlConfig)
  ]
  return yamlMarkup.join('\n')
}

/**
 * Convert some data (usually Javascript objets) into the YAML format and write
 * the string into a text file.
 *
 * @param {String} filePath - The file path of the destination yaml file. The
 *   yml extension has to be included.
 * @param {Object} data - Some data to convert into yaml and write into a text
 *   file.
 *
 * @returns {String} - The data converted to YAML as a string.
 */
function writeYamlFile (filePath, data) {
  const yaml = yamlToTxt(data)
  fs.writeFileSync(filePath, yaml)
  return yaml
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
  readAssetYaml,
  writeMetaDataYaml,
  writeYamlFile,
  yamlToTxt
}
