// Node packages.
import fs from 'fs'
import path from 'path'

// Third party packages.
import chalk from 'chalk'
import wikidata from '@bldr/wikidata'

// Project packages.
import { writeYamlFile, metaTypes } from '@bldr/media-manager'
import type { AssetType } from '@bldr/type-definitions'

/**
 * @param {String} metaType - For example `group`, `instrument`, `person`,
 *   `song`
 * @param {String} itemId - For example `Q123`
 * @param {String} arg1
 * @param {String} arg2
 */
async function action (metaType: string, itemId: string, arg1: string, arg2: string, cmdObj: { [key: string]: any }): Promise<void> {
  let rawData = await wikidata.query(itemId, metaType, metaTypes.typeSpecs)
  if (arg1) {
    if (metaType === 'person') {
      rawData.firstname = arg1
      rawData.lastname = arg2
    }
  }
  rawData.metaTypes = metaType
  const data = <AssetType.FileFormat> metaTypes.process(rawData)
  console.log(data)

  let downloadWikicommons = true
  if (!rawData.mainImage) {
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

export = action
