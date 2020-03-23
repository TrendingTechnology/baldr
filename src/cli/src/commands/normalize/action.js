// Node packages.
const fs = require('fs')

// Third party packages.
const yaml = require('js-yaml')

// Project packages.
const mediaServer = require('@bldr/media-server')
const queryWikidata = require('@bldr/wikidata')

const lib = require('../../lib.js')

/**
 * @param {String} filePath - The media asset file path.
 */
async function normalizeOneFile (filePath) {
  try {
    const metaTypes = mediaServer.metaTypes
    const typeName = metaTypes.detectTypeByPath(filePath)
    const yamlFile = `${filePath}.yml`
    let metaData = yaml.safeLoad(lib.readFile(yamlFile))
    metaData.type = typeName
    metaData = mediaServer.metaTypes.process(metaData)
    console.log(metaData)
    if (metaData.wikidata && metaData.type) {
      const wikidata = await queryWikidata(metaData.wikidata, metaData.type)
      console.log(wikidata)
    }
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
    async asset (relPath) {
      if (fs.existsSync(`${relPath}.yml`)) {
        await normalizeOneFile(relPath)
      }
    }
  }, {
    path: files
  })
}

module.exports = action
