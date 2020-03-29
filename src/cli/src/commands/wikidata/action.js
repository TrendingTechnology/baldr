// Node packages.
const fs = require('fs')

// Third party packages.
const chalk = require('chalk')
const wikidata = require('@bldr/wikidata')

// Project packages.
const lib = require('../../lib.js')
const metaTypes = require('@bldr/media-server').metaTypes

/**
 * @param {String} metaType - For example `group,instrument,person,song`
 * @param {String} itemId - For example `Q123`
 * @param {String} arg1
 * @param {String} arg2
 */
async function action (metaType, itemId, arg1, arg2, cmdObj) {
  let data = await wikidata.query(itemId, metaType)
  if (arg1) {
    if (metaType === 'person') {
      data.firstname = arg1
      data.lastname = arg2
    }
  }
  data.metaType = metaType
  data = metaTypes.process(data)
  console.log(data)

  if (data.mainImage) {
    const dest = metaTypes.formatFilePath(data)
    if (!cmdObj.dryRun) {
      await wikidata.fetchCommonsFile(data.mainImage, dest)
    } else {
      console.log(`Dry run! Destination: ${chalk.green(dest)}`)
    }
    const yamlFile = `${dest}.yml`
    if (!fs.existsSync(yamlFile)) {
      if (!cmdObj.dryRun) {
        console.log(`Write YAML file: ${chalk.green(yamlFile)}`)
        lib.writeYamlFile(yamlFile, data)
      }
    } else {
      console.log(`The YAML file already exists: ${chalk.red(yamlFile)}`)
    }
  }
}

module.exports = action
