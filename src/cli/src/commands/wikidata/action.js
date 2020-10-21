// Node packages.
const fs = require('fs')
const path = require('path')

// Third party packages.
const chalk = require('chalk')
const wikidata = require('@bldr/wikidata')

// Project packages.
const metaTypes = require('@bldr/media-server').metaTypes
const { writeYamlFile } = require('@bldr/media-manager')

/**
 * @param {String} metaType - For example `group`, `instrument`, `person`,
 *   `song`
 * @param {String} itemId - For example `Q123`
 * @param {String} arg1
 * @param {String} arg2
 */
async function action (metaType, itemId, arg1, arg2, cmdObj) {
  let data = await wikidata.query(itemId, metaType, metaTypes.typeSpecs)
  if (arg1) {
    if (metaType === 'person') {
      data.firstname = arg1
      data.lastname = arg2
    }
  }
  data.metaTypes = metaType
  data = metaTypes.process(data)
  console.log(data)

  let downloadWikicommons = true
  if (!data.mainImage) {
    data.mainImage = 'blank.jpg'
    downloadWikicommons = false
  }

  const dest = metaTypes.formatFilePath(data)
  if (downloadWikicommons) {
    if (!cmdObj.dryRun) {
      await wikidata.fetchCommonsFile(data.mainImage, dest)
    } else {
      console.log(`Dry run! Destination: ${chalk.green(dest)}`)
    }
  }

  if (!cmdObj.dryRun && !fs.existsSync(dest)) {
    const src = path.join(__dirname, '..', '..', 'blank.jpg')
    console.log(src)
    fs.mkdirSync(path.dirname(dest), { recursive: true })
    fs.copyFileSync(src, dest)
    console.log(`No Wikicommons file. Use temporary blank file instead.`)
  }

  const yamlFile = `${dest}.yml`
  if (!fs.existsSync(yamlFile)) {
    if (!cmdObj.dryRun) {
      console.log(`Write YAML file: ${chalk.green(yamlFile)}`)
      writeYamlFile(yamlFile, data)
    }
  } else {
    console.log(`The YAML file already exists: ${chalk.red(yamlFile)}`)
  }
}

module.exports = action
