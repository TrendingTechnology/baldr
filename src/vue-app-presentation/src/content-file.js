/**
 * @file Parse, process and validate the presentation content file (YAML).
 */

// import Vue from 'vue'
import yaml from 'js-yaml'
import { shortenText } from '@bldr/core-browser'
import { masters } from '@/masters.js'
import store from '@/store.js'
import router from '@/router.js'
import vue from '@/main.js'

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
 * Provide data to render a slide.
 *
 * Normalize the slide data to allow different input formats from the yaml
 * file.
 *
 * @param {module:@bldr/core/slides~rawSlideData} rawSlideData
 *   Various types of data to render a slide.
 */
class RenderData {
  constructor (rawSlideObject) {
    const intersection = intersect(
      masters.allNames,
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
     *
     * @type {string}
     */
    this.masterName = intersection[0]

    /**
     * Data in various types to pass to a master slide.
     * Normalized master data. This data gets passed through the master slides,
     * to the props of the Vue components.
     * @type {module:@bldr/core/masters~rawMasterData}
     */
    this.props = rawSlideObject.cut(this.masterName)

    /**
     * A list of media URIs.
     *
     * @type {array}
     */
    this.mediaUris = []

    const master = masters.get(this.masterName)
    const normalizedProps = master.normalizeProps(this.props)
    if (normalizedProps) {
      this.props = normalizedProps
    }
    master.detectUnkownProps(this.props)
    master.markupToHtml(this.props)

    const mediaUris = master.resolveMediaUris(this.props)
    if (mediaUris) this.mediaUris = mediaUris

    /**
     * How many steps the slide provides.
     *
     * @type {number}
     */
    this.stepCount = master.stepCount(this.props)

    /**
     * The current step number. The first number is 1 not 0.
     *
     * @type {number}
     */
    this.stepNoCurrent = 1
  }
}

/**
 *
 */
export class MetaData {
  /**
   * @param {*} rawSlideObject
   */
  constructor (rawSlideObject) {
    this.title = rawSlideObject.cut('title')
  }
}

/**
 * A slide.
 */
class Slide {
  /**
   *
   */
  constructor (rawSlideData, slideNo) {
    const rawSlideObject = new RawSlideObject(rawSlideData)
    /**
     * The slide number
     * @type {Number}
     */
    this.no = slideNo

    /**
     * Normalized slide data to render the slide.
     */
    this.renderData = new RenderData(rawSlideObject)

    /**
     *
     */
    this.master = masters.get(this.renderData.masterName)

    /**
     *
     */
    this.metaData = new MetaData(rawSlideObject)

    if (!rawSlideObject.isEmpty()) {
      throw Error(`Unknown slide properties: ${toString(rawSlideObject.raw)}`)
    }
  }

  get title () {
    if (this.metaData.title) {
      return this.metaData.title
    }
    let plain = this.plainText
    plain = plain.replace(/\|/g, '')
    return shortenText(plain)
  }

  /**
   * Collect all plain text of the slide.
   *
   * @returns {String}
   */
  get plainText () {
    const output = []
    const fromProps = this.master.plainTextFromProps(this.renderData.props)
    if (fromProps) output.push(fromProps)
    for (const mediaFile of this.mediaFiles) {
      output.push(mediaFile.plainText)
    }
    return output.join(' | ')
  }

  get mediaFiles () {
    const mediaFiles = []
    for (const mediaUri of this.renderData.mediaUris) {
      mediaFiles.push(store.getters['media/mediaFileByUri'](mediaUri))
    }
    return mediaFiles
  }

  get contentTheme () {
    if (this.master.styleConfig.contentTheme) {
      return this.master.styleConfig.contentTheme
    } else {
      return 'default'
    }
  }
}

/**
 * A presentation
 *
 * @property {object} meta
 * @property {object} slides
 * @property {object} media
 * @property {string} rawYamlString_
 * @property {string} rawYamlObject_
 */
export class Presentation {
  /**
   * Convert an array of raw slide data into an object. The slide data is
   * indexed by the slide number. Slides are numbered beginning from 1 not from 0.
   * We reindex.
   *
   * @param {array} slides
   *
   * @returns {object}
   */
  reIndex (slides) {
    const out = {}
    for (const index in slides) {
      out[Number.parseInt(index) + 1] = slides[index]
    }
    return out
  }

  async parseYamlFile (rawYamlString) {
    this.rawYamlString_ = rawYamlString
    try {
      this.rawYamlObject_ = yaml.safeLoad(rawYamlString)
    } catch (error) {
      throw new Error(`${error.name}: ${error.message}`)
    }
    /**
     * The meta object.
     *
     * ```yaml
     * meta:
     *   title: My title
     * ```
     *
     * @type {object}
     */
    this.meta = this.rawYamlObject_.meta
    // slides
    const indexedSlides = this.reIndex(this.rawYamlObject_.slides)
    this.slides = {}
    const mediaUris = []
    for (const slideNo in indexedSlides) {
      const slide = new Slide(indexedSlides[slideNo], slideNo)
      this.slides[slideNo] = slide
      for (const mediaUri of slide.renderData.mediaUris) {
        mediaUris.push(mediaUri)
      }
    }
    // media
    if (mediaUris.length > 0) {
      this.media = await vue.$media.resolve(mediaUris)
    }
  }

  /**
   * The title of the presentation specified in:
   *
   * ```yml
   * meta:
   *   title: My Title
   * ```
   */
  get title () {
    if (this.meta.title) return this.meta.title
  }

  /**
   * The ID of the presentation
   *
   * ```yml
   * meta:
   *   id: My-Presentation
   * ```
   */
  get id () {
    if (this.meta.id) return this.meta.id
  }
}

/**
 * Open, analyze and handle a file, which is dragged into the application or
 * opened with the file dialog. Distinct between media files and the YAML
 * *.baldr.yml file format.
 *
 * @param {File} file - A file interface.
 */
function openFile (file) {
  if (file.type === 'application/x-yaml' &&
      file.name.toLowerCase().indexOf('.baldr.yml') > -1) {
    let reader = new FileReader()
    reader.readAsText(file, 'utf-8')
    reader.onload = readerEvent => {
      let content = readerEvent.target.result
      store.dispatch('openPresentation', content).then(() => {
        if (router.currentRoute.name !== 'slides') router.push({ name: 'slides' })
      })
    }
  } else {
    vue.$media.resolve(file)
  }
}


/**
 * Open multiple files.
 *
 * @param {array} files - An array of File objects.
 */
export function openFiles (files) {
  for (const file of files) {
    openFile(file)
  }
}
