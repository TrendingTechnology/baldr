/**
 * @file Load the slides object form the YAML file format and process it.
 *
 */

import yaml from 'js-yaml'
import { themeNames } from './themes.js'
import { masterNames, callMasterFunc } from './masters.js'

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

/**
 * Normalize the slide data to allow different input formats from the yaml
 * file.
 *
 * @param {module:@bldr/core/slides~rawSlideData} rawSlideData
 *   Various types of data to render a slide.
 */
class SlideData {
  constructor (rawSlideData) {
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
      const { masterName, rawMasterData } = this.pullMasterfromString_(rawSlideData)
      rawSlideData = {}
      this.masterName = masterName
      this.rawMasterData = rawMasterData
    // object
    } else if (typeof rawSlideData === 'object' && !Array.isArray(rawSlideData)) {
      const { masterName, rawMasterData } = this.pullMasterfromObject_(rawSlideData)
      this.masterName = masterName
      this.rawMasterData = rawMasterData
      this.themeName = this.pullTheme_(rawSlideData)
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
  pullMasterfromString_ (rawSlideData) {
    if (masterNames.includes(rawSlideData)) {
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
  pullMasterfromObject_ (rawSlideData) {
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
  pullTheme_ (rawSlideData) {
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

/**
 * Maybe the class SlideData and Slide should be merged.
 */
class Slide {
  /**
   *
   */
  constructor (rawSlideData, slideNo) {
    this.no = slideNo

    /**
     * Normalized slide data.
     * @type {module:@bldr/core/slides~SlideData}
     */
    this.slideData = new SlideData(rawSlideData)

    /**
     * Normalized master data. This data gets passed through the master slides,
     * to the props of the Vue components.
     * @type {module:@bldr/core/masters~masterData}
     */
    this.masterData = this.slideData.rawMasterData
    const normalizedData = callMasterFunc(
      this.slideData.masterName,
      'normalizeData',
      this.slideData.rawMasterData
    )
    if (normalizedData) {
      this.masterData = normalizedData
    }
  }
}

/**
 * Convert an array of raw slide data into an object. The slide data is
 * indexed by the slide number. Slides are numbered beginning from 1 not from 0.
 * We reindex.
 *
 * @param {array} slides
 *
 * @returns {object}
 */
function reIndex (slides) {
  const out = {}
  for (const index in slides) {
    out[Number.parseInt(index) + 1] = slides[index]
  }
  return out
}

/**
 * Parse the presentation file format. It is in the YAML format.
 *
 * @param {string} content - The content of the YAML file as a string
 *
 * @returns {object}
 */
export function parseYamlFile (content) {
  const rawYaml = yaml.safeLoad(content)
  console.log(rawYaml)
  const indexedSlides = reIndex(rawYaml.slides)
  console.log(indexedSlides)
  const slides = {}
  for (const slideNo in indexedSlides) {
    slides[slideNo] = new Slide(indexedSlides[slideNo], slideNo)
  }
  return slides
}
