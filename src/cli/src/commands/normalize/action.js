// Node packages.
const fs = require('fs')

// Third party packages.
const yaml = require('js-yaml')

// Project packages.
const mediaServer = require('@bldr/media-server')

const lib = require('../../lib.js')

/**
 * @param {String} filePath - The media asset file path.
 */
function normalizeOneFile (filePath) {
  try {
    const metaTypes = mediaServer.metaTypes
    const typeName = metaTypes.detectTypeByPath(filePath)
    const yamlFile = `${filePath}.yml`
    let metaData = yaml.safeLoad(lib.readFile(yamlFile))
    metaData.type = typeName
    metaData = mediaServer.metaTypes.process(metaData)
    console.log(metaData)
    metaData = lib.normalizeMetaData(filePath, metaData)
    //lib.writeYamlFile(yamlFile, metaData)
  } catch (error) {
    console.log(filePath)
    console.log(error)
    process.exit()
  }
}

/**
 * @param {Array} files - An array of input files, comes from the commanders’
 *   variadic parameter `[files...]`.
 */
function action (files) {
  mediaServer.walk({
    asset (relPath) {
      if (fs.existsSync(`${relPath}.yml`)) {
        normalizeOneFile(relPath)
      }
    }
  }, {
    path: files
  })
}

module.exports = action
