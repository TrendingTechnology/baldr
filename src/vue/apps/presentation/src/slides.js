/**
 * @file Load the slides object form the YAML file format and process it.
 *
 */

import yaml from 'js-yaml'

/**
 * A raw slide object or a raw slide string.
 *
 * If a string is obtained, it should be the name of a master slide.
 * This type is the direct input of the markdown configuration file
 * converted to a Javascript types.
 *
 * # Object with one property:
 *
 *     - markdown: Some text
 *
 * # Object with multiple properties:
 *
 *     - title: A quote
 *       quote:
 *         author: Goethe
 *         text: lol
 *
 * # String:
 *
 *     - camera
 *
 * @typedef rawSlideData
 * @type {(object|string)}
 */

/**
 * Various types of data to render a slide.
 * @typedef rawSlideData
 * @type {(boolean|number|string|array|object)}
 */

export function parseYamlFile (content) {
  return yaml.safeLoad(content)
}

export function reIndex (array) {
  const out = {}
  for (const index in array) {
    out[Number.parseInt(index) + 1] = array[index]
  }
  return out
}

export class SlideData {
  /**
   * @param {module:@bldr/core/slides~rawSlideData} rawSlideData
   *   Various types of data to render a slide.
   * @param {module:@bldr/core~Environment} env Low level
   *   environment data.
   */
  constructor (rawSlideData, env) {
    /**
     * Various types of data to render a slide.
     * @type {module:@bldr/core/slides~rawSlideData}
     */
    this.rawSlideData = Object.assign({}, rawSlideData)

    /**
     * The name of a theme.
     * @type {string}
     */
    this.themeName = false

    /**
     * The name of the master slide.
     * @type {string}
     */
    this.masterName = false

    /**
     * Data in various types to pass to a master slide.
     * @type {module:@bldr/core/masters~rawMasterData}
     */
    this.rawMasterData = false

    // string
    if (typeof rawSlideData === 'string') {
      const { masterName, rawMasterData } = this.pullMasterfromString_(
        rawSlideData, env.masters.all
      )
      rawSlideData = {}
      this.masterName = masterName
      this.rawMasterData = rawMasterData
    // object
    } else if (typeof rawSlideData === 'object' && !Array.isArray(rawSlideData)) {
      const { masterName, rawMasterData } = this.pullMasterfromObject_(
        rawSlideData, env.masters.all
      )
      this.masterName = masterName
      this.rawMasterData = rawMasterData
      this.themeName = this.pullTheme_(
        rawSlideData, env.themes.all
      )
    // something else
    } else {
      throw Error(`Unsupported input type “${this.getType_(rawSlideData)}” on input data: ${this.toString_(rawSlideData)}`)
    }

    if (Object.keys(rawSlideData).length > 0) {
      throw Error(`Unknown slide properties: ${this.toString_(rawSlideData)}`)
    }
  }

  /**
   *
   */
  pullProperty_ (rawSlideData, property) {
    if ({}.hasOwnProperty.call(rawSlideData, property)) {
      const out = rawSlideData[property]
      delete rawSlideData[property]
      return out
    } else {
      return false
    }
  }

  /**
   * Get the intersection between all master names and the slide keys.
   *
   * This method can be used to check that a slide object uses only
   * one master slide.
   *
   * @param {array} array1
   * @param {array} array2
   * @return {array} The intersection as an array
   */
  intersect_ (array1, array2) {
    return array1.filter((n) => array2.includes(n))
  }

  /**
   *
   */
  pullMasterfromString_ (rawSlideData, masters) {
    if (masters.includes(rawSlideData)) {
      return {
        masterName: rawSlideData,
        rawMasterData: true
      }
    } else {
      throw Error(`Unknown master “${rawSlideData}” specified as string`)
    }
  }

  /**
   *
   */
  pullMasterfromObject_ (rawSlideData, masterNames) {
    const intersection = this.intersect_(
      masterNames,
      Object.keys(rawSlideData)
    )

    if (intersection.length === 0) {
      throw Error(`No master slide found: ${this.toString_(rawSlideData)}`)
    }

    if (intersection.length > 1) {
      throw Error(`Each slide must have only one master slide: ${this.toString_(rawSlideData)}`)
    }
    const masterName = intersection[0]
    const rawMasterData = rawSlideData[masterName]
    this.pullProperty_(rawSlideData, masterName)

    return {
      masterName: masterName,
      rawMasterData: rawMasterData
    }
  }

  /**
   *
   */
  pullTheme_ (rawSlideData, themeNames) {
    if (!{}.hasOwnProperty.call(rawSlideData, 'theme')) {
      return false
    } else if (themeNames.includes(rawSlideData.theme)) {
      const theme = rawSlideData.theme
      this.pullProperty_(rawSlideData, 'theme')
      return theme
    } else {
      throw Error(`Unkown theme: “${this.toString_(rawSlideData.theme)}”`)
    }
  }

  /**
   *
   */
  toString_ (rawSlideData) {
    if (rawSlideData === null) {
      return 'null'
    } else if (!rawSlideData) {
      return typeof rawSlideData
    } else if (typeof rawSlideData === 'string') {
      return rawSlideData
    } else if (Array.isArray(rawSlideData)) {
      return rawSlideData.toString()
    } else {
      return JSON.stringify(rawSlideData)
    }
  }

  /**
   *
   */
  getType_ (rawSlideData) {
    if (Array.isArray(rawSlideData)) {
      return 'array'
    } else if (rawSlideData === null) {
      return 'null'
    } else {
      return typeof rawSlideData
    }
  }
}
