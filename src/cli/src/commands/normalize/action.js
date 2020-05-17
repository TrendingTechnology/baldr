// Node packages.
const fs = require('fs')
const assert = require('assert')

// Third party packages.
const yaml = require('js-yaml')
const chalk = require('chalk')

// Project packages.
const mediaServer = require('@bldr/media-server')
const wikidata = require('@bldr/wikidata')
const { deepCopy, msleep } = require('@bldr/core-browser')

const lib = require('../../lib.js')

async function queryWikidata (metaData, typeNames, typeSpecs) {
  console.log(`Query wikidata item “${chalk.yellow(metaData.wikidata)}” for meta data types “${chalk.yellow(typeNames)}”`)
  const dataWiki = await wikidata.query(metaData.wikidata, typeNames, typeSpecs)
  console.log(dataWiki)
  metaData = wikidata.mergeData(metaData, dataWiki, typeSpecs)
  // To avoid blocking
  // url: 'https://www.wikidata.org/w/api.php?action=wbgetentities&ids=Q16276296&format=json&languages=en%7Cde&props=labels',
  // status: 429,
  // statusText: 'Scripted requests from your IP have been blocked, please
  // contact noc@wikimedia.org, and see also https://meta.wikimedia.org/wiki/User-Agent_policy',
  msleep(3000)
  return metaData
}

/**
 * @returns {String}
 */
function mergeMetaTypeNames () {
  const types = new Set()
  for (i = 0; i < arguments.length; i++) {
    const typeNames = arguments[i]
    if (typeNames) {
      for (const typeName of typeNames.split(',')) {
        types.add(typeName)
      }
    }
  }
  return [...types].join(',')
}

/**
 * @param {String} filePath - The media asset file path.
 */
async function normalizeOneFile (filePath, cmdObj) {
  try {
    const metaTypes = mediaServer.metaTypes
    // Always: general
    const typeNames = metaTypes.detectTypeByPath(filePath)
    const yamlFile = `${filePath}.yml`
    let metaData = lib.readAssetYaml(filePath)
    metaData.filePath = filePath
    const origData = deepCopy(metaData)

    metaData.metaTypes = mergeMetaTypeNames(metaData.metaTypes, typeNames)

    if (cmdObj.wikidata) {
      if (metaData.wikidata && metaData.metaTypes) {
        metaData = await queryWikidata(metaData, metaData.metaTypes, metaTypes.typeSpecs)
      } else {
        console.log(chalk.red(`To enrich the metadata using wikidata a property named “wikidata” is needed.`))
      }
    }
    metaData = metaTypes.process(metaData)

    try {
      delete origData.filePath
      assert.deepStrictEqual(origData, metaData)
      console.log(chalk.green('\nNo changes:\n'))
      console.log(metaData)
    } catch (error) {
      // console.log(error.message)
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

module.exports = {
  action,
  normalizeOneFile
}
