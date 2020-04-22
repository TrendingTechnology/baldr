/**
 * @module @bldr/wikidata
 */

// Node packages.
const fs = require('fs')
const childProcess = require('child_process')
const path = require('path')
const URL = require('url').URL

// Third party packages.
const fetch = require('node-fetch')
const wikibase = require('wikibase-sdk')({
  instance: 'https://www.wikidata.org',
  sparqlEndpoint: 'https://query.wikidata.org/sparql'
})

/**
 * The specification of a property.
 *
 * @typedef {Object} propSpec
 * @property {(String|Array)} wikidata.fromClaim - for example `P123` or
 *   `['P123', 'P234']`. If `fromClaim` is an array, the first existing claim
 *   an a certain item is taken.
 * @property {String} wikidata.fromEntity - `getDescription`, `getLabel`,
 *   `getWikipediaTitle`. If `fromClaim` is specifed and the item has
 *   a value on this claim, `fromEntity` is omitted.
 * @property {String} wikidata.secondQuery - `queryLabels`
 * @property {Boolean} wikidata.alwaysUpdate
 * @property {(Function|String)} wikidata.format - A function or `formatDate`,
 *   `formatYear`, `formatWikicommons`, `formatList`, `formatSingleValue`.
 */

/**
 * Additional properties in the specification of one metadata type.
 *
 * @typedef {Object} typeSpec
 * @property {Function} normalizeWikidata - This functions is called after
 *   properties are present. The function is called with
 *   `function ({ typeData, entity, functions })`
 */

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
 * @param {(Array|String)} values
 * @param {Boolean} onlyOne - Return only the first item of an array if there
 *   more
 * @param {Boolean} throwError - If there are more than values in an array.
 *
 * @returns {(Array|String)}
 */
function unpackArray (values, onlyOne, throwError) {
  if (!values) return
  if (Array.isArray(values)) {
    if (values.length === 1) {
      return values[0]
    } else if (throwError) {
      throw new Error(`Array has more than one item: ${values}`)
    }
  }
  if (Array.isArray(values) && values.length > 1 && onlyOne) {
    return values[0]
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
async function fetchFile (url, dest) {
  const response = await fetch(new URL(url))
  fs.mkdirSync(path.dirname(dest), { recursive: true })
  fs.writeFileSync(dest, Buffer.from(await response.arrayBuffer()))
  if (fs.existsSync(dest)) {
    const stat = fs.statSync(dest)
    if (stat.size > 500000) {
      const process = childProcess.spawnSync('magick', [
        'convert',
        dest,
        '-resize', '2000x2000>', // http://www.imagemagick.org/Usage/resize/#shrink
        '-quality', '60', // https://imagemagick.org/script/command-line-options.php#quality
        dest
      ])
      if (process.status !== 0) {
        throw new Error(`Error resizing image ${dest}`)
      }
    }
  }
}

/**
 * Download a file from wiki commonds.
 *
 * @param {String} fileName - The file name from wiki commonds.
 * @param {String} dest - A file path where to store the file locally.
 */
async function fetchCommonsFile (fileName, dest) {
  // wikicommons:George-W-Bush.jpeg
  fileName = fileName.replace('wikicommons:', '')
  const url = wikibase.getImageUrl(fileName)
  await fetchFile(url, dest)
}

/**
 * Get data from one claim. Try multiple claims to get the first existing
 * claim.
 *
 * @param {Object} entity
 * @param {(String|Array)} claims
 *
 * @returns {Mixed}
 */
function getClaim (entity, claims) {
  /**
   * @param {Object} entity
   * @param {String} claim
   */
  function getSingleClaim (entity, claim) {
    if (entity.claims[claim]) {
      const typeData = entity.claims[claim]
      return unpackArray(typeData)
    }
  }

  if (Array.isArray(claims)) {
    for (const claim of claims) {
      const typeData = getSingleClaim(entity, claim)
      if (typeData) return typeData
    }
  } else {
    return getSingleClaim(entity, claims)
  }
}

/**
 * A collection of functions
 *
 * @type {Object}
 */
const functions = {

  /*******************************************************************************
 * get from entity
 ******************************************************************************/

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
  getDescription: function (entity) {
    const desc = entity.descriptions
    if (desc.de) {
      return desc.de
    } else if (desc.en) {
      return desc.en
    }
  },

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
  getLabel: function (entity) {
    let label
    if (entity.labels.de) {
      label = entity.labels.de
    } else if (entity.labels.en) {
      label = entity.labels.en
    }
    return unpackArray(label)
  },

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
  getWikipediaTitle: function (entity) {
    const sitelinks = entity.sitelinks
    const keys = Object.keys(sitelinks)
    if (!keys.length) return
    let key
    if (sitelinks.dewiki) {
      key = 'dewiki'
    } else if (sitelinks.enwiki) {
      key = 'enwiki'
    } else {
      key = keys.shift()
    }
    if (!key) return
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
  },

  /*******************************************************************************
 * second query
 ******************************************************************************/

  /**
   * Query the wikidata API for the given items and return only the label.
   *
   * @param {(Array|String)} itemIds - for example `['Q123', 'Q234']`
   *
   * @returns {(Array|String)}
   */
  queryLabels: async function (itemIds) {
    itemIds = unpackArray(itemIds)
    const entities = await getEntities(itemIds, ['labels'])
    if (entities.id) {
      return functions.getLabel(entities, false)
    }
    const result = []
    for (const itemId in entities) {
      const entity = entities[itemId]
      result.push(functions.getLabel(entity, false))
    }
    return result
  },

  /*******************************************************************************
 * format
 ******************************************************************************/

  /**
    * @param {(Array|String)} date - for example `[ '1770-12-16T00:00:00.000Z' ]`
    *
    * @returns {String}
    */
  formatDate: function (date) {
    // Frederic Chopin has two birth dates.
    // throw no error
    date = unpackArray(date, true, false)
    if (!date) return
    return date.replace(/T.+$/, '')
  },

  /**
   * @param {(Array|String)} list
   *
   * @returns {String}
   */
  formatList: function (list) {
    if (Array.isArray(list)) {
      return list.join(', ')
    }
    return list
  },

  /**
   * Extract the 4 digit year from a date string
   *
   * @param {String} dateSpec - For example `1968-01-01`
   *
   * @returns {String} for example `1968`
   */
  formatYear: function (dateSpec) {
    // Janis Joplin Cry Baby has two dates as an array.
    value = unpackArray(dateSpec, true, false)
    return value.substr(0, 4)
  },

  /**
   * Replace all white spaces with an underscore and prefix “wikicommons:”.
   *
   * @param {String} value
   *
   * @returns {String}
   */
  formatWikicommons: function (value) {
    value = unpackArray(value, true, false)
    value = value.replace(/ /g, '_')
    return `wikicommons:${value}`
  },

  /**
   * Only return one value, not an array of values.
   *
   * @param {(Array|String)} value
   *
   * @returns {String}
   */
  formatSingleValue: function (value) {
    if (Array.isArray(value)) return value[0]
    return value
  }
}

/**
 * Merge two objects containing metadata: a original metadata object and a
 * object obtained from wikidata. Override a property in original only if
 * `alwaysUpdate` is set on the property specification.
 *
 * @public
 *
 * @param {Object} dataOrig
 * @param {Object} dataWiki
 * @param {module:@bldr/media-server/meta-types~typeSpecs}
 *
 * @returns {Object}
 */
function mergeData (data, dataWiki, typeSpecs) {
  // Ẃe delete properties from this object -> make a flat copy.
  const dataOrig = Object.assign({}, data)
  const typeName = dataOrig.metaType
  if (!typeName) {
    return Object.assign({}, dataOrig, dataWiki)
  }

  const propSpecs = typeSpecs[typeName]

  const typeData = {}

  for (const propName in dataWiki) {
    const propSpec = propSpecs[propName].wikidata
    if (propSpec && ((dataOrig[propName] && propSpec.alwaysUpdate) || !dataOrig[propName])) {
      typeData[propName] = dataWiki[propName]
      delete dataOrig[propName]
    } else {
      typeData[propName] = dataWiki[propName]
    }
  }

  for (const propName in dataOrig) {
    typeData[propName] = dataOrig[propName]
  }
  return typeData
}

/**
 * Query wikidata.
 *
 * @public
 *
 * @param {String} itemId - for example `Q123`
 * @param {module:@bldr/media-server/meta-types~typeNames} typeNames
 * @param {module:@bldr/media-server/meta-types~typeSpecs} typeSpecs
 *
 * @returns {Object}
 */
async function query (itemId, typeNames, typeSpecs) {
  if (!wikibase.isItemId(itemId)) {
    throw new Error(`No item id: ${itemId}`)
  }
  entity = await getEntities(itemId)

  if (typeNames.indexOf('general') === -1) typeNames = `general,${typeNames}`

  const data = {}
  data.wikidata = itemId
  for (const typeName of typeNames.split(',')) {
    if (!typeSpecs[typeName]) {
      throw new Error(`Unkown type name: “${typeName}”`)
    }

    const typeSpec = typeSpecs[typeName]

    for (const propName in typeSpec.props) {
      if (typeSpec.props[propName].wikidata) {
        const propSpec = typeSpec.props[propName].wikidata
        let value

        // source
        if (!propSpec.fromClaim && !propSpec.fromEntity) {
          throw new Error(`Spec must have a source property (“fromClaim” or “fromEntity”): ${JSON.stringify(propSpec)}`)
        }
        if (propSpec.fromClaim) {
          value = getClaim(entity, propSpec.fromClaim)
        }

        if (!value && propSpec.fromEntity) {
          const func = functions[propSpec.fromEntity]
          if (typeof func !== 'function') {
            throw new Error(`Unkown from entity source “${propSpec.fromEntity}”`)
          }
          value = func(entity)
        }

        // second query
        if (value && propSpec.secondQuery) value = await functions[propSpec.secondQuery](value)

        // format
        if (value && propSpec.format) {
          if (typeof propSpec.format === 'function') {
            value = propSpec.format(value, typeSpec)
          } else {
            const func = functions[propSpec.format]
            if (typeof func !== 'function') {
              let formatFunctions = Object.keys(functions)
              formatFunctions = formatFunctions.filter((value) => value.match(/^format.*/))
              formatFunctions = formatFunctions.join()
              throw new Error(`Unkown format function “${propSpec.format}”. Use one of: ${formatFunctions}`)
            }
            value = func(value, typeSpec)
          }
        }

        if (value) data[propName] = value
      }
    }
    if (typeSpec.normalizeWikidata) {
      typeSpec.normalizeWikidata({ typeData: data, entity, functions })
    }
  }

  return data
}

module.exports = {
  fetchCommonsFile,
  mergeData,
  query
}
