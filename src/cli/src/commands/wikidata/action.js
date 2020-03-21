// Node packages.
const fs = require('fs')
const path = require('path')

// Third party packages.
const chalk = require('chalk')
const fetch = require('node-fetch')
const wikibase = require('wikibase-sdk')({
  instance: 'https://www.wikidata.org',
  sparqlEndpoint: 'https://query.wikidata.org/sparql'
})

// Project packages.
const mediaServer = require('@bldr/api-media-server')
const lib = require('../../lib.js')

// Globals.
const { config } = require('../../main.js')

function getWikipediaTitle (sitelinks) {
  let key
  if (sitelinks.dewiki) {
    key = 'dewiki'
  } else {
    key = 'enwiki'
  }
  // https://de.wikipedia.org/wiki/Ludwig_van_Beethoven
  const siteLink = wikibase.getSitelinkUrl({ site: key, title: sitelinks[key] })
  if (!siteLink) return
  // {
  //   lang: 'de',
  //   project: 'wikipedia',
  //   key: 'dewiki',
  //   title: 'Ludwig_van_Beethoven',
  //   url: 'https://de.wikipedia.org/wiki/Ludwig_van_Beethoven'
  // }
  const linkData = wikibase.getSitelinkData(siteLink)
  return `${linkData.lang}:${linkData.title}`
}

async function getItems (itemIds, props) {
  const url = wikibase.getEntities(itemIds, ['en', 'de'], props)
  const response = await fetch(url)
  const json = await response.json()
  return await wikibase.parse.wd.entities(json)
}

async function getItem (itemId) {
  const entites = await getItems(itemId)
  return entites[itemId]
}

function formatDate (date) {
  // [ '1770-12-16T00:00:00.000Z' ]
  if (!date) return
  return date.replace(/T.+$/, '')
}

/**
 * ```js
 * claims: {
 *   P1477: [ 'Elvis Aaron Presley' ],
 *   P735: [ 'Q1174817' ]
 * }
 * ```
 */
class Claims {
  constructor (claims) {
    this.claims = claims
  }

  getClaim (claim) {
    let result
    if (this.claims[claim]) {
      result = this.claims[claim]
    }
    if (!result) return
    if (Array.isArray(result)) {
      return result[0]
    }
    return result
  }

  getMultipleClaims (claim) {
    if (this.claims[claim]) {
      return this.claims[claim]
    }
  }

  getDate (claim) {
    return formatDate(this.getClaim(claim))
  }

  async getName (claim) {
    //  Name in Amts- oder Originalsprache (P1705)  ?
    const itemId = this.getClaim(claim)
    if (!itemId) return
    const entity = await getItem(itemId)
    if (entity.labels.de) {
      return entity.labels.de
    } else {
      return entity.labels.en
    }
  }
}

/**
 *
 * @param {String} url
 * @param {String} dest
 */
async function downloadFile (url, dest) {
  const response = await fetch(url)
  fs.writeFileSync(dest, Buffer.from(await response.arrayBuffer()))
}

/**
 *
 * @param {String} filename
 * @param {String} dest
 */
async function downloadWikicommonsFile (filename, dest) {
  const url = wikibase.getImageUrl(filename)
  await downloadFile(url, dest)
}

/**
 * ```js
 * {
 *   id: 'Q312609',
 *   type: 'item',
 *   modified: '2020-03-01T19:08:47Z',
 *   labels: { de: 'Cheb Khaled', en: 'Khaled' },
 * }
 * ```
 *
 * @param {Object} entity
 *
 * @returns {Array|String}
 */
function getLabel (entity, asArray = true) {
  let label
  if (entity.labels.de) {
    label = entity.labels.de
  } else if (entity.labels.en) {
    label = entity.labels.en
  }

  if (label) {
    if (asArray) {
      return label.split(' ')
    }
    return label
  }
}

async function queryLabels (itemIds) {
  const result = []
  const entities = await getItems(itemIds, ['labels'])
  for (const itemId in entities) {
    const entity = entities[itemId]
    result.push(getLabel(entity, false))
  }
  return result
}

async function queryLabel (itemId) {
  const result = await queryLabels(itemId)
  if (result && result.length > 0) {
    return result[0]
  }
}

const specs = {
  group: {
    // offizieller Name
    name: {
      claim: 'P1448'
    },
    // Gründung, Erstellung bzw. Entstehung
    startData: {
      claim: 'P571',
      format: formatDate
    },
    // Auflösungsdatum
    endData: {
      claim: 'P576',
      format: formatDate
    },
    // besteht aus
    members: {
      claim: 'P527',
      multiple: true,
      secondQuery: queryLabels
    }
  },
  person: {
    // Vornamen der Person
    firstname: {
      claim: 'P735',
      secondQuery: queryLabel
    },
    // Familienname einer Person
    lastname: {
      claim: 'P734',
      secondQuery: queryLabel
    },
    birth: {
      claim: 'P569',
      format: formatDate
    },
    death: {
      claim: 'P570',
      format: formatDate
    },
    wikipedia: {
      wikipediaTitle: true
    }
  }
}

/**
 *
 * @param {String} itemId - For example `Q123`
 * @param {String} firstname
 * @param {String} lastname
 */
async function person (itemId, firstname, lastname) {
  const entity = await getItem(itemId)
  console.log(entity)
  const claims = new Claims(entity.claims)

  const label = getLabel(entity)
  const firstnameFromLabel = label.shift()
  const lastnameFromLabel = label.pop()

  // Vornamen der Person (P735)
  if (!firstname) firstname = await claims.getName('P735')
  if (!firstname) firstname = firstnameFromLabel
  // Familienname einer Person (P734)
  if (!lastname) lastname = await claims.getName('P734')
  if (!lastname) lastname = lastnameFromLabel

  // Use the label by artist names.
  // for example „Joan Baez“ and not „Joan Chandos“
  if (firstnameFromLabel && firstname !== firstnameFromLabel) firstname = firstnameFromLabel
  if (lastnameFromLabel && lastname !== lastnameFromLabel) lastname = lastnameFromLabel

  // Name in Muttersprache (P1559)
  let name = claims.getClaim('P1559')
  if (!name) name = `${firstname} ${lastname}`
  const id = mediaServer.asciify(`${lastname}_${firstname}`)
  const title = `Portrait-Bild von „${name}“`

  let short_biography
  const desc = entity.descriptions
  if (desc.de) {
    short_biography = desc.de
  } else if (desc.en) {
    short_biography = desc.en
  }

  const birth = claims.getDate('P569')
  const death = claims.getDate('P570')
  const wikidata = itemId
  const wikipedia = getWikipediaTitle(entity.sitelinks)
  const wikicommons = claims.getClaim('P18')

  const parentDir = path.join(
    config.mediaServer.basePath,
    'Personen',
    id.substr(0, 1).toLowerCase() // for example: a, b
  )
  fs.mkdirSync(parentDir, { recursive: true })
  const dest = path.join(parentDir, `${id}.jpg`)

  if (fs.existsSync(dest)) {
    console.log(`The image already exists: ${chalk.red(dest)}`)
  } else {
    if (wikicommons) {
      await downloadWikicommonsFile(wikicommons, dest)
      console.log(`Image downloaded to: ${chalk.green(dest)}`)
    }

    if (fs.existsSync(dest)) {
      const stat = fs.statSync(dest)
      if (stat.size > 500000) {
        lib.runImagemagick(dest, dest)
      }
    } else {
      console.log(chalk.red(`No image downloaded.`))
    }
  }

  const result = {
    id,
    title,
    firstname,
    lastname,
    name,
    short_biography,
    birth,
    death,
    wikidata,
    wikipedia,
    wikicommons
  }

  for (const key in result) {
    if (!result[key]) {
      delete result[key]
    }
  }
  const yamlFile = `${dest}.yml`
  if (!fs.existsSync(yamlFile)) {
    console.log(`Write YAML file: ${chalk.green(yamlFile)}`)
    lib.writeYamlFile(yamlFile, result)
  } else {
    console.log(`The YAML file already exists: ${chalk.red(yamlFile)}`)
  }
}

async function resolveBySpecs (itemId, specs) {
  const entity = await getItem(itemId)
  const claims = new Claims(entity.claims)

  const result = {}
  for (const property in specs) {
    const spec = specs[property]
    let value
    if (spec.claim) {
      if (spec.multiple) {
        value = claims.getMultipleClaims(spec.claim)
      } else {
        value = claims.getClaim(spec.claim)
      }
    } else if (spec.wikipediaTitle) {
      value = getWikipediaTitle(entity.sitelinks)
    }

    if (spec.secondQuery) value = await spec.secondQuery(value)
    if (spec.format) value = spec.format(value)
    result[property] = value
  }
  console.log(result)
}

/**
 *
 * @param {String} itemId - For example `Q123`
 * @param {String} arg1
 * @param {String} arg2
 */
async function action (itemId, arg1, arg2, cmdObj) {
  if (!wikibase.isItemId(itemId)) {
    throw new Error(`No item id: ${itemId}`)
  }
  if (cmdObj.group) {
    await resolveBySpecs(itemId, specs.group)
  } else if (cmdObj.person) {
    await resolveBySpecs(itemId, specs.person)
  } else {
    await person(itemId, arg1, arg2)
  }
}

module.exports = action
