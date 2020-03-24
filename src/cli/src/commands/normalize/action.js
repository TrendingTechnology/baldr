// Node packages.
const fs = require('fs')
const assert = require('assert')

// Third party packages.
const yaml = require('js-yaml')
const chalk = require('chalk')

// Project packages.
const mediaServer = require('@bldr/media-server')
const wikidata = require('@bldr/wikidata')
const { deepCopy } = require('@bldr/core-browser')

const lib = require('../../lib.js')

/**
 * @param {String} filePath - The media asset file path.
 */
async function normalizeOneFile (filePath, cmdObj) {
  try {
    const metaTypes = mediaServer.metaTypes
    const typeName = metaTypes.detectTypeByPath(filePath)
    const yamlFile = `${filePath}.yml`
    let metaData = yaml.safeLoad(lib.readFile(yamlFile))
    const origData = deepCopy(metaData)
    metaData.metaType = typeName

    if (cmdObj.wikidata) {
      if (metaData.wikidata && metaData.metaType) {
        const dataWiki = await wikidata.query(metaData.wikidata, metaData.metaType)
        metaData = wikidata.mergeData(metaData, dataWiki)
      } else {
        console.log(chalk.red(`To enrich the metadata using wikidata a property named “wikidata” is needed.`))
      }
    }
    metaData = mediaServer.metaTypes.process(metaData)
    // TODO: remove. outsource all code into the typeSpecs
    metaData = lib.normalizeMetaData(filePath, metaData)

    try {
      assert.deepStrictEqual(origData, metaData)
      console.log(chalk.green('\nNo changes:\n'))
      console.log(metaData)
    } catch (error) {
      //console.log(error.message)
      console.log(chalk.yellow('\nOriginal data:\n'))
      console.log(origData)
      console.log(chalk.green('\nResult data:\n'))
      console.log(metaData)

      lib.writeYamlFile(yamlFile, metaData)
    }
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
function action (files, cmdObj) {
  mediaServer.walk({
    async asset (relPath) {
      if (fs.existsSync(`${relPath}.yml`)) {
        await normalizeOneFile(relPath, cmdObj)
      }
    }
  }, {
    path: files
  })
}

module.exports = action
