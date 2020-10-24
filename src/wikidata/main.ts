/**
 * @module @bldr/wikidata
 */

// Node packages.
import * as fs from 'fs'
import * as childProcess from 'child_process'
import fetch from 'node-fetch'

// Third party packages.
import * as wikibaseSdk from 'wikibase-sdk'

const wikibase = wikibaseSdk({
  instance: 'https://www.wikidata.org',
  sparqlEndpoint: 'https://query.wikidata.org/sparql'
})

import { fetchFile } from '@bldr/media-manager'
import { MetaSpec } from '@bldr/type-definitions'

interface LabelsCollection {
  de: string
  en: string
}

interface DescriptionsCollection {
  de: string
  en: string
}

interface ClaimsCollection {
  [key: string]: string[]
}

interface SitelinksCollection {
  dewiki: string
  enwiki: string
  [key: string]: string
}

interface Entity {
  id: string
  labels: LabelsCollection
  descriptions: DescriptionsCollection
  claims: ClaimsCollection
  sitelinks: SitelinksCollection
}

interface EntityCollection {
  [key: string]: Entity
}

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
 let entity: Entity

/**
 * If the array has only one item, return only this item, else return
 * the original array.
 *
 * @param values
 * @param onlyOne - Return only the first item of an array if there
 *   more
 * @param throwError - If there are more than values in an array.
 */
function unpackArray (values: string | string[], onlyOne?: boolean, throwError?: boolean): string | string[] {
  if (!values) return ''
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
 * Return the first element of a string array.
 *
 * @param values
 */
function pickFirst (values: string | string[]): string {
  return <string> unpackArray(values, true, false)
}

/**
 *
 * @param itemIds
 * @param props - for example `['labels']`
 */
async function getEntities (itemIds: string[] | string, props?: string[]): Promise<Entity | EntityCollection> {
  const url = wikibase.getEntities(itemIds, ['en', 'de'], props)
  const response = await fetch(url)
  const json = await response.json()
  const entities = await wikibase.parse.wd.entities(json)
  if (Array.isArray(itemIds)) return entities
  return entities[itemIds]
}

/**
 * @param url
 * @param dest
 */
async function fetchResizeFile (url: string, dest: string) {
  await fetchFile(url, dest)
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
async function fetchCommonsFile (fileName: string, dest: string) {
  // wikicommons:George-W-Bush.jpeg
  fileName = fileName.replace('wikicommons:', '')
  const url = wikibase.getImageUrl(fileName)
  await fetchResizeFile(url, dest)
}

/**
 * Get data from one claim. Try multiple claims to get the first existing
 * claim.
 *
 * @param entity
 * @param claims
 */
function getClaim (entity: Entity, claims: string | string[]) {
  /**
   * @param {Object} entity
   * @param {String} claim
   */
  function getSingleClaim (entity: Entity, claim: string) {
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
 */
const functions: {[key: string]: Function } = {

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
    * @param entity
    */
  getDescription: function (entity: Entity): string {
    const desc = entity.descriptions
    if (desc.de) {
      return desc.de
    } else if (desc.en) {
      return desc.en
    }
    return ''
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
  getLabel: function (entity: Entity): string {
    if (entity.labels.de) {
      return entity.labels.de
    } else {
      return entity.labels.en
    }
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
   * @param entity
   */
  getWikipediaTitle: function (entity: Entity): string {
    const sitelinks = entity.sitelinks
    const keys = Object.keys(sitelinks)
    if (!keys.length) return ''
    let key
    if (sitelinks.dewiki) {
      key = 'dewiki'
    } else if (sitelinks.enwiki) {
      key = 'enwiki'
    } else {
      key = keys.shift()
    }
    if (!key) return ''
    // https://de.wikipedia.org/wiki/Ludwig_van_Beethoven
    const siteLink = wikibase.getSitelinkUrl({ site: key, title: sitelinks[key] })
    if (!siteLink) return ''
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
   * @param itemIds - for example `['Q123', 'Q234']`
   */
  queryLabels: async function (itemIds: string | string[]): Promise<string | string[]> {
    itemIds = unpackArray(itemIds)
    const entities = await getEntities(itemIds, ['labels'])
    if (entities.id) {
      const entity = <Entity> entities
      return functions.getLabel(entity)
    }
    const result: string[] = []
    for (const itemId in entities) {
      const entity = (entities as EntityCollection)[itemId]
      result.push(<string> functions.getLabel(entity))
    }
    return result
  },

/*******************************************************************************
 * format
 ******************************************************************************/

  /**
    * @param date - for example `[ '1770-12-16T00:00:00.000Z' ]`
    */
  formatDate: function (date: string | string[]): string {
    // Frederic Chopin has two birth dates.
    // throw no error
    date = pickFirst(date)
    if (!date) return ''
    return date.replace(/T.+$/, '')
  },

  /**
   * @param list
   */
  formatList: function (list: string | string[]): string {
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
  formatYear: function (dateSpec: string | string[]): string {
    // Janis Joplin Cry Baby has two dates as an array.
    const value = pickFirst(dateSpec)
    return value.substr(0, 4)
  },

  /**
   * Replace all white spaces with an underscore and prefix “wikicommons:”.
   *
   * @param value
   */
  formatWikicommons: function (value: string | string[]): string {
    value = pickFirst(value)
    value = value.replace(/ /g, '_')
    return `wikicommons:${value}`
  },

  /**
   * Only return one value, not an array of values.
   *
   * @param value
   */
  formatSingleValue: function (value: string | string[]): string {
    if (Array.isArray(value)) return value[0]
    return value
  }
}

/**
 * Merge two objects containing metadata: a original metadata object and a
 * object obtained from wikidata. Override a property in original only if
 * `alwaysUpdate` is set on the property specification.
 *
 * @param dataOrig
 * @param dataWiki
 * @param typeSpecs
 */
function mergeData (data: MetaSpec.Data, dataWiki: MetaSpec.Data, typeSpecs: MetaSpec.TypeCollection): MetaSpec.Data {
  // Ẃe delete properties from this object -> make a flat copy.
  const dataOrig = Object.assign({}, data)

  if (!dataOrig.metaTypes) {
    return Object.assign({}, dataOrig, dataWiki)
  }

  const typeData: MetaSpec.Data = {}

  for (const typeName of dataOrig.metaTypes.split(',')) {
    const propSpecs = typeSpecs[<MetaSpec.TypeName> typeName].props
    for (const propName in dataWiki) {
      if (propSpecs[propName] && propSpecs[propName].wikidata) {
        const propSpec = propSpecs[propName].wikidata
        if (propSpec && ((dataOrig[propName] && propSpec.alwaysUpdate) || !dataOrig[propName])) {
          typeData[propName] = dataWiki[propName]
          delete dataOrig[propName]
        } else {
          typeData[propName] = dataWiki[propName]
        }
      }
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
 * @param itemId - for example `Q123`
 * @param typeNames
 * @param typeSpecs
 */
async function query (itemId: string, typeNames: MetaSpec.TypeNames, typeSpecs: MetaSpec.TypeCollection): Promise<object> {
  if (!wikibase.isItemId(itemId)) {
    throw new Error(`No item id: ${itemId}`)
  }
  entity = <Entity> await getEntities(itemId)

  if (typeNames.indexOf('general') === -1) typeNames = `general,${typeNames}`

  const data: { [key: string]: any } = {}
  data.wikidata = itemId
  for (const typeName of typeNames.split(',')) {
    if (!typeSpecs[<MetaSpec.TypeName> typeName]) {
      throw new Error(`Unkown type name: “${typeName}”`)
    }

    const typeSpec = typeSpecs[<MetaSpec.TypeName> typeName]

    for (const propName in typeSpec.props) {
      if (typeSpec.props[propName].wikidata) {
        const propSpec = <MetaSpec.WikidataProp> typeSpec.props[propName].wikidata
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
              throw new Error(`Unkown format function “${propSpec.format}”. Use one of: ${formatFunctions.join()}`)
            }
            value = func(value)
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
