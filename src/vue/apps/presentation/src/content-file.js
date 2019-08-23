/**
 * @file Parse, process and validate the presentation content file (YAML).
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
 * Convert various data to a string. Meant for error messages.
 *
 * @param {mixed} data - various data
 *
 * @return {string}
 */
function toString (data) {
  if (data === null) {
    return 'null'
  } else if (!data) {
    return typeof data
  } else if (typeof data === 'string') {
    return data
  } else if (Array.isArray(data)) {
    return data.toString()
  } else {
    return JSON.stringify(data)
  }
}

/**
 * Extended version of typeof
 */
function getType (data) {
  if (Array.isArray(data)) {
    return 'array'
  } else if (data === null) {
    return 'null'
  } else {
    return typeof data
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
function intersect (array1, array2) {
  return array1.filter((n) => array2.includes(n))
}

/**
 * The raw data object of one slide coming directly from the YAML file. This
 * class holds the data, to pass it to different classes which “harvesting”
 * different properties. At the end of the data handling the result should be
 * an empty object.
 *
 * @param {object|string} rawData
 */
class RawSlideObject {
  constructor (rawData) {
    if (getType(rawData) === 'string') {
      rawData = {
        rawData: true
      }
    }
    if (getType(rawData) !== 'object') {
      throw Error(`Unsupported input type “${getType(rawData)}” on input data: ${toString(rawData)}`)
    }
    this.raw = rawData
  }
  /**
   * Cut properties from the raw object: delete the property
   *
   * @returns {mixed} The data stored in the property
   */
  cut (property) {
    if ({}.hasOwnProperty.call(this.raw, property)) {
      const out = this.raw[property]
      delete this.raw[property]
      return out
    }
    return false
  }

  isEmpty () {
    if (Object.keys(this.raw).length === 0) return true
    return false
  }
}

/**
 * Normalize the slide data to allow different input formats from the yaml
 * file.
 *
 * @param {module:@bldr/core/slides~rawSlideData} rawSlideData
 *   Various types of data to render a slide.
 */
class MasterData {
  constructor (rawSlideObject) {
    const intersection = intersect(
      masterNames,
      Object.keys(rawSlideObject.raw)
    )

    if (intersection.length === 0) {
      throw Error(`No master slide found: ${toString(rawSlideObject.raw)}`)
    }

    if (intersection.length > 1) {
      throw Error(`Each slide must have only one master slide: ${toString(rawSlideObject.raw)}`)
    }

    /**
     * The name of the master slide.
     * @type {string}
     */
    this.name = intersection[0]

    /**
     * Data in various types to pass to a master slide.
     * Normalized master data. This data gets passed through the master slides,
     * to the props of the Vue components.
     * @type {module:@bldr/core/masters~rawMasterData}
     */
    this.data = rawSlideObject.cut(this.name)

    const normalizedData = callMasterFunc(this.name, 'normalizeData', this.data)
    if (normalizedData) this.data = normalizedData
  }
}

export class ThemeData {
  constructor () {
    /**
     * The name of a theme.
     * @type {string}
     */
    this.themeName = false
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
}

export class MetaData {

}

/**
 * Maybe the class SlideData and Slide should be merged.
 */
class Slide {
  /**
   *
   */
  constructor (rawSlideData, slideNo) {
    const rawSlideObject = new RawSlideObject(rawSlideData)
    this.no = slideNo

    /**
     * Normalized slide data.
     * @type {module:@bldr/core/slides~SlideData}
     */
    this.master = new MasterData(rawSlideObject)

    if (!rawSlideObject.isEmpty()) {
      throw Error(`Unknown slide properties: ${toString(rawSlideObject.raw)}`)
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
 * Parse the presentation content file. It is in the YAML format.
 *
 * @param {string} content - The content of the YAML file as a string
 *
 * @returns {object}
 */
export function parseContentFile (content) {
  const rawYaml = yaml.safeLoad(content)
  // Slides
  const indexedSlides = reIndex(rawYaml.slides)
  const slides = {}
  for (const slideNo in indexedSlides) {
    slides[slideNo] = new Slide(indexedSlides[slideNo], slideNo)
  }
  return {
    slides: slides
  }
}
