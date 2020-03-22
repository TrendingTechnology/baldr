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

/**
 * ```js
 * let entity = {
 *   id: 'Q202698',
 *   type: 'item',
 *   modified: '2020-03-20T20:27:33Z',
 *   labels: { de: 'Yesterday', en: 'Yesterday' },
 *   descriptions: {
 *     en: 'original song written and composed by Lennon-McCartney',
 *     de: 'Lied von The Beatles'
 *   },
 *   aliases: {},
 *   claims: {
 *     P175: [ 'Q1299' ],
 *     P31: [ 'Q207628', 'Q7366' ],
 *     P435: [ '0c80db24-389e-3620-8e0b-84dc2b7c009a' ],
 *     P646: [ '/m/01227d' ]
 *   },
 *   sitelinks: {
 *     arwiki: 'يسترداي',
 *     cawiki: 'Yesterday',
 *     cswiki: 'Yesterday (píseň)',
 *     dawiki: 'Yesterday',
 *     dewiki: 'Yesterday',
 *     elwiki: 'Yesterday (τραγούδι, The Beatles)',
 *     enwiki: 'Yesterday (Beatles song)'
 *   }
 * }
 * ```
 */
let entity = null

/**
 * If the array has only one item, return only this item, else return
 * the original array.
 *
 * @param {Array} values
 *
 * @returns {(Array|String)}
 */
function unpackArray (values, throwError) {
  if (!values) return
  if (Array.isArray(values)) {
    if (values.length === 1) {
      return values[0]
    } else if (throwError) {
      throw new Error(`Array has more than one item: ${values}`)
    }
  }
  return values
}

/**
 *
 * @param {Array|String} itemIds
 * @param {Array} props - for example `['labels']`
 *
 * @returns {Object}
 */
async function getEntities (itemIds, props) {
  const url = wikibase.getEntities(itemIds, ['en', 'de'], props)
  const response = await fetch(url)
  const json = await response.json()
  const entities = await wikibase.parse.wd.entities(json)
  if (Array.isArray(itemIds)) return entities
  return entities[itemIds]
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

/*******************************************************************************
 * get from entity
 ******************************************************************************/

function getClaims (entity, claim) {
  let result
  if (entity.claims[claim]) {
    result = entity.claims[claim]
  }
  return unpackArray(result)
}

/**
 *
 * ```js
 * entity = {
 *   sitelinks: {
 *     afwiki: 'The Beatles',
 *     akwiki: 'The Beatles',
 *   }
 * }
 * ```
 *
 * @param {Object} entity
 */
function getWikipediaTitle (entity) {
  const sitelinks = entity.sitelinks
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

/**
 * ```js
 * const entity = {
 *   id: 'Q1299',
 *   type: 'item',
 *   modified: '2020-03-15T20:18:33Z',
 *   descriptions: { en: 'English pop-rock band', de: 'Rockband aus Liverpool' }
 * }
 * ```
 *
 * @param {Object} entity
 */
function getDescription (entity) {
  const desc = entity.descriptions
  if (desc.de) {
    return desc.de
  } else if (desc.en) {
    return desc.en
  }
}

/**
 * ```js
 * const entity = {
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
function getLabel (entity) {
  let label
  if (entity.labels.de) {
    label = entity.labels.de
  } else if (entity.labels.en) {
    label = entity.labels.en
  }
  return unpackArray(label)
}

/*******************************************************************************
 * second query
 ******************************************************************************/

/**
  * @param {Array} itemIds - for example `['Q123', 'Q234']`
  */
async function queryLabels (itemIds) {
  itemIds = unpackArray(itemIds)
  const entities = await getEntities(itemIds, ['labels'])
  if (entities.id) {
    return getLabel(entities, false)
  }
  const result = []
  for (const itemId in entities) {
    const entity = entities[itemId]
    result.push(getLabel(entity, false))
  }
  return result
}

/*******************************************************************************
 * format
 ******************************************************************************/

/**
  * @param {(Array|String)} date - for example `[ '1770-12-16T00:00:00.000Z' ]`
  *
  * @returns {String}
  */
function formatDate (date) {
  date = unpackArray(date, true)
  if (!date) return
  return date.replace(/T.+$/, '')
}

/*******************************************************************************
 * specs
 ******************************************************************************/

const specs = {
  group: {
    // offizieller Name
    name: {
      source: {
        fromClaim: 'P1448'
      }
    },
    shortHistory: {
      source: {
        fromEntity: getDescription
      }
    },
    // Gründung, Erstellung bzw. Entstehung
    startData: {
      source: {
        fromClaim: 'P571'
      },
      format: formatDate
    },
    // Auflösungsdatum
    endData: {
      source: {
        fromClaim: 'P576'
      },
      format: formatDate
    },
    // besteht aus
    members: {
      source: {
        fromClaim: 'P527'
      },
      secondQuery: queryLabels
    },
    wikipedia: {
      source: {
        fromEntity: getWikipediaTitle
      }
    }
  },
  instrument: {
    name: {
      source: {
        fromEntity: getLabel
      }
    },
    // Bild
    mainImage: {
      source: {
        fromClaim: 'P18'
      }
    },
    // Bild des Tonumfang
    playingRangeImage: {
      source: {
        fromClaim: 'P2343'
      }
    },
    wikipedia: {
      source: {
        fromEntity: getWikipediaTitle
      }
    }
  },
  person: {
    // Vornamen der Person
    firstname: {
      source: {
        fromClaim: 'P735'
      },
      secondQuery: queryLabels
    },
    // Familienname einer Person
    lastname: {
      source: {
        fromClaim: 'P734'
      },
      secondQuery: queryLabels
    },
    // Geburtsdatum
    birth: {
      source: {
        fromClaim: 'P569'
      },
      format: formatDate
    },
    // Sterbedatum
    death: {
      source: {
        fromClaim: 'P570'
      },
      format: formatDate
    },
    wikipedia: {
      source: {
        fromEntity: getWikipediaTitle
      }
    }
  },
  song: {
    // Veröffentlichungsdatum
    publicationDate: {
      source: {
        fromClaim: 'P577'
      },
      format: formatDate
    },
    // Sprache des Werks, Namens oder Begriffes
    language: {
      source: {
        fromClaim: 'P407'
      },
      secondQuery: queryLabels
    },
    // Interpret
    artist: {
      source: {
        fromClaim: 'P175'
      },
      secondQuery: queryLabels
    },
    // Text von
    lyricist: {
      source: {
        fromClaim: 'P676'
      },
      secondQuery: queryLabels
    },
    // Genre
    genre: {
      source: {
        fromClaim: 'P136'
      },
      secondQuery: queryLabels
    },
    wikipedia: {
      source: {
        fromEntity: getWikipediaTitle
      }
    }
  }
}

async function resolveBySpecs (itemId, specs) {
  entity = await getEntities(itemId)

  const result = {}
  result.wikidata = itemId
  for (const property in specs) {
    const spec = specs[property]
    let value

    // source
    if (!spec.source) {
      throw new Error(`Spec must have a source: ${JSON.stringify(spec)}`)
    }
    if (spec.source.fromClaim) {
      value = getClaims(entity, spec.source.fromClaim)
    } else if (spec.source.fromEntity) {
      value = spec.source.fromEntity(entity)
    }

    // second query
    if (value && spec.secondQuery) value = await spec.secondQuery(value)

    // format
    if (value && spec.format) value = spec.format(value)
    if (value) result[property] = value
  }
  console.log(result)
}

/**
 * @param {String} metadataType - For example `group,instrument,person,song`
 * @param {String} itemId - For example `Q123`
 * @param {String} arg1
 * @param {String} arg2
 */
async function action (metadataType, itemId, arg1, arg2) {
  if (!specs[metadataType]) {
    throw new Error(`No metadata type given: Use ${Object.keys(specs)}`)
  }

  if (!wikibase.isItemId(itemId)) {
    throw new Error(`No item id: ${itemId}`)
  }

  await resolveBySpecs(itemId, specs[metadataType])
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

//   if (fs.existsSync(dest)) {
//     console.log(`The image already exists: ${chalk.red(dest)}`)
//   } else {
//     if (wikicommons) {
//       await downloadWikicommonsFile(wikicommons, dest)
//       console.log(`Image downloaded to: ${chalk.green(dest)}`)
//     }

//     if (fs.existsSync(dest)) {
//       const stat = fs.statSync(dest)
//       if (stat.size > 500000) {
//         lib.runImagemagick(dest, dest)
//       }
//     } else {
//       console.log(chalk.red(`No image downloaded.`))
//     }
//   }

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
