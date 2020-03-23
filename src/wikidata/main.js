/**
 * @module @bldr/wikidata
 */

// Node packages.
const fs = require('fs')

// Third party packages.
const fetch = require('node-fetch')
const wikibase = require('wikibase-sdk')({
  instance: 'https://www.wikidata.org',
  sparqlEndpoint: 'https://query.wikidata.org/sparql'
})

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
 * typeSpecs
 ******************************************************************************/

const typeSpecs = {
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
      format: formatDate,
      alwaysUpdate: true
    },
    // Sterbedatum
    death: {
      source: {
        fromClaim: 'P570'
      },
      format: formatDate,
      alwaysUpdate: true
    },
    short_biography: {
      source: {
        fromEntity: getDescription
      }
    },
    wikipedia: {
      source: {
        fromEntity: getWikipediaTitle
      },
      alwaysUpdate: true
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

/**
 * Merge two objects containing metadata: a original metadata object and a
 * object obtained from wikidata. Override a property in original only if
 * `alwaysUpdate` is set on the property specification.
 *
 * @param {Object} dataOrig
 * @param {Object} dataWiki
 *
 * @returns {Object}
 */
function mergeData (data, dataWiki) {
  // Ẃe delete properties from this object -> make a flat copy.
  const dataOrig = Object.assign({}, data)
  let metaTypeName = dataOrig.type
  if (!metaTypeName) metaTypeName = dataWiki.type
  if (!metaTypeName) {
    return Object.assign({}, dataOrig, dataWiki)
  }

  const propSpecs = typeSpecs[metaTypeName]

  result = {}

  for (const propName in dataWiki) {
    const propSpec = propSpecs[propName]
    if (propSpec && (dataOrig[propName] && propSpec.alwaysUpdate) || !dataOrig[propName]) {
      result[propName] = dataWiki[propName]
      delete dataOrig[propName]
    } else {
      result[propName] = dataWiki[propName]
    }
  }

  for (const propName in dataOrig) {
    result[propName] = dataOrig[propName]
  }
  return result
}

/**
 *
 * @param {String} itemId
 * @param {String} metaTypeName
 *
 * @returns {Object}
 */
async function query (itemId, metaTypeName) {
  if (!wikibase.isItemId(itemId)) {
    throw new Error(`No item id: ${itemId}`)
  }
  entity = await getEntities(itemId)

  if (!typeSpecs[metaTypeName]) return

  const propSpecs = typeSpecs[metaTypeName]

  const result = {}
  result.wikidata = itemId
  for (const propName in propSpecs) {
    const propSpec = propSpecs[propName]
    let value

    // source
    if (!propSpec.source) {
      throw new Error(`Spec must have a source: ${JSON.stringify(spec)}`)
    }
    if (propSpec.source.fromClaim) {
      value = getClaims(entity, propSpec.source.fromClaim)
    } else if (propSpec.source.fromEntity) {
      value = propSpec.source.fromEntity(entity)
    }

    // second query
    if (value && propSpec.secondQuery) value = await propSpec.secondQuery(value)

    // format
    if (value && propSpec.format) value = propSpec.format(value)
    if (value) result[propName] = value
  }
  return result
}

module.exports = {
  mergeData,
  query
}
