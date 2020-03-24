// Node packages.
const path = require('path')
const fs = require('fs')

// Third party packages.
const wikidata = require('@bldr/wikidata')
const chalk = require('chalk')

// Project packages.
const { getExtension } = require('@bldr/core-browser')
const metaTypes = require('@bldr/media-server').metaTypes
const lib = require('../../lib.js')

/**
 * @param {String} metaType - For example `group,instrument,person,song`
 * @param {String} itemId - For example `Q123`
 * @param {String} arg1
 * @param {String} arg2
 */
async function action (metaType, itemId, arg1, arg2) {
  let data = await wikidata.query(itemId, metaType)
  data.metaType = metaType
  data = metaTypes.process(data)
  console.log(data)

  if (data.mainImage) {
    const typeSpec = metaTypes.typeSpecs[metaType]
    // The relPath function needs this.extension.
    data.extension = getExtension(data.mainImage)
    const relPath = typeSpec.relPath.call(data)
    const dest = path.join(typeSpec.basePath, relPath)
    await wikidata.fetchCommonsFile(data.mainImage, dest)
    const yamlFile = `${dest}.yml`
    if (!fs.existsSync(yamlFile)) {
      console.log(`Write YAML file: ${chalk.green(yamlFile)}`)
      lib.writeYamlFile(yamlFile, data)
    } else {
      console.log(`The YAML file already exists: ${chalk.red(yamlFile)}`)
    }
  }
}

module.exports = action

/**
 *
 * @param {String} itemId - For example `Q123`
 * @param {String} firstname
 * @param {String} lastname
 */
// async function person (itemId, firstname, lastname) {
//   const entity = await getItem(itemId)
//   console.log(entity)
//   const claims = new Claims(entity.claims)

//   const label = getLabel(entity)
//   const firstnameFromLabel = label.shift()
//   const lastnameFromLabel = label.pop()

//   // Vornamen der Person (P735)
//   if (!firstname) firstname = await claims.getName('P735')
//   if (!firstname) firstname = firstnameFromLabel
//   // Familienname einer Person (P734)
//   if (!lastname) lastname = await claims.getName('P734')
//   if (!lastname) lastname = lastnameFromLabel

//   // Use the label by artist names.
//   // for example „Joan Baez“ and not „Joan Chandos“
//   if (firstnameFromLabel && firstname !== firstnameFromLabel) firstname = firstnameFromLabel
//   if (lastnameFromLabel && lastname !== lastnameFromLabel) lastname = lastnameFromLabel

//   // Name in Muttersprache (P1559)
//   let name = claims.getClaim('P1559')
//   if (!name) name = `${firstname} ${lastname}`
//   const id = mediaServer.asciify(`${lastname}_${firstname}`)
//   const title = `Portrait-Bild von „${name}“`

//   let short_biography
//   const desc = entity.descriptions
//   if (desc.de) {
//     short_biography = desc.de
//   } else if (desc.en) {
//     short_biography = desc.en
//   }

//   const birth = claims.getDate('P569')
//   const death = claims.getDate('P570')
//   const wikidata = itemId
//   const wikipedia = getWikipediaTitle(entity.sitelinks)
//   const wikicommons = claims.getClaim('P18')

//   const parentDir = path.join(
//     config.mediaServer.basePath,
//     'Personen',
//     id.substr(0, 1).toLowerCase() // for example: a, b
//   )
//   fs.mkdirSync(parentDir, { recursive: true })
//   const dest = path.join(parentDir, `${id}.jpg`)

  // if (fs.existsSync(dest)) {
  //   console.log(`The image already exists: ${chalk.red(dest)}`)
  // } else {
  //   if (wikicommons) {
  //     await downloadWikicommonsFile(wikicommons, dest)
  //     console.log(`Image downloaded to: ${chalk.green(dest)}`)
  //   }

  //   if (fs.existsSync(dest)) {
  //     const stat = fs.statSync(dest)
  //     if (stat.size > 500000) {
  //       lib.runImagemagick(dest, dest)
  //     }
  //   } else {
  //     console.log(chalk.red(`No image downloaded.`))
  //   }
  // }

//   const result = {
//     id,
//     title,
//     firstname,
//     lastname,
//     name,
//     short_biography,
//     birth,
//     death,
//     wikidata,
//     wikipedia,
//     wikicommons
//   }

//   for (const key in result) {
//     if (!result[key]) {
//       delete result[key]
//     }
//   }
//   const yamlFile = `${dest}.yml`
//   if (!fs.existsSync(yamlFile)) {
//     console.log(`Write YAML file: ${chalk.green(yamlFile)}`)
//     lib.writeYamlFile(yamlFile, result)
//   } else {
//     console.log(`The YAML file already exists: ${chalk.red(yamlFile)}`)
//   }
// }
