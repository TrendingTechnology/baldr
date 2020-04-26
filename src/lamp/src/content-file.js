/**
 * Parse, process and validate the presentation content file (YAML).
 *
 * @module @bldr/lamp/content-file
 */

/* globals defaultThemeSassVars FileReader */

// import Vue from 'vue'
import yaml from 'js-yaml'
import { shortenText, convertPropertiesCase, escapeHtml, deepCopy, jsYamlConfig, RawDataObject } from '@bldr/core-browser'
import { WrappedSamples } from '@bldr/vue-plugin-media'
import { markupToHtml } from '@/lib'
import { masters } from '@/masters.js'
import store from '@/store/index.js'
import { router, views } from '@/routes.js'
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
 * @type {Object}
 */

/**
 * Router paramters that indicate a specific slide with an step number
 * in a specific presentation.
 *
 * @typedef {Object} routerParams
 * @property {String} presId - The ID of the presentation, for example
 *   `Tradition_Futurismus`
 * @property {Number} slideNo - The slide number starting from 1.
 * @property {Number} stepNo  - The step number starting from 1.
 */

function getNavRouteNameFromRoute (to, from) {
  if (from.name === 'speaker-view' || from.name === 'speaker-view-step-no') {
    if (to.stepNo) {
      return 'speaker-view-step-no'
    } else {
      return 'speaker-view'
    }
  } else {
    if (to.stepNo) {
      return 'slide-step-no'
    } else {
      return 'slide'
    }
  }
}

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
class RawSlideObject extends RawDataObject {
  constructor (rawData) {
    if (getType(rawData) === 'string') {
      const raw = {}
      if (masters.exists(rawData)) {
        raw[rawData] = true
      } else {
        raw.generic = {
          markup: rawData
        }
      }
      rawData = raw
    }
    if (getType(rawData) !== 'object') {
      throw Error(`Unsupported input type “${getType(rawData)}” on input data: ${toString(rawData)}`)
    }
    super(rawData)
  }
}

/**
 * The meta data of a slide. Each slide object owns one meta data object.
 */
export class MetaData {
  /**
   * @param {Object} rawSlideObject
   */
  constructor (rawSlideObject) {
    this.rawSlideObject_ = rawSlideObject

    /**
     * The ID of a slide (Used for links)
     */
    this.id = this.grabProperty_('id')

    /**
     * The title of a slide.
     *
     * @type {String}
     */
    this.title = this.grabProperty_('title')

    /**
     * Some text that describes the slide.
     *
     * @type {String}
     */
    this.description = this.grabProperty_('description')

    /**
     * The source of the slide, for example a HTTP URL.
     *
     * @type {String}
     */
    this.source = this.grabProperty_('source')
  }

  grabProperty_ (property) {
    const text = this.rawSlideObject_.cut(property)
    if (text) return markupToHtml(text)
    return null
  }
}

/**
 * Compile a sass string to a css string.
 *
 * @param {String} sass
 *
 * @see {@link https://stackoverflow.com/a/34725742/10193818 Stackoverflow}
 */
function compileToCSS (sass) {
  sass = String(sass)
  const output = sass.replace(/;$/, '')
  return output.replace(/(\$[a-zA-Z0-9-]+)/g, function ($1, $2) {
    return defaultThemeSassVars[$2]
  })
}

/**
 * Normalize (replace SASS vars, remove ; at the of the entries) a style object.
 *
 * @param {Object} style - The raw style object from the YAML format.
 *
 * @returns {Object} - The normalized style object
 */
function normalizeStyle (style) {
  for (const property in style) {
    style[property] = compileToCSS(style[property])
  }
  return style
}

/**
 * Each slide can be overlayed by a play button to play audio files on each
 * slide.
 *
 * See component `AudioOverlay.vue`
 *
 * @see {@link module:@bldr/vue-plugin-media~WrappedSample}
 * @see {@link module:@bldr/vue-plugin-media.WrappedSamples}
 * @see {@link module:@bldr/lamp/content-file~AudioOverlay}
 */
class AudioOverlay {
  /**
   * @param {Object|String|Array} rawData - Raw data from the yaml key
   *   `audio_overlay: `
   */
  constructor (rawData) {
    /**
     * @type {boolean}
     */
    this.showTitles = false

    /**
     * @type {module:@bldr/vue-plugin-media.WrappedSamples}
     */
    this.wrappedSamples = null
    if (typeof rawData === 'object' && rawData.samples && rawData.showTitles) {
      this.wrappedSamples = new WrappedSamples(rawData.samples)
      this.showTitles = rawData.showTitles
    } else {
      this.wrappedSamples = new WrappedSamples(rawData)
    }

    /**
     * Media URIs as an array.
     *
     * @type {Array}
     */
    this.mediaUris = this.wrappedSamples.uris
  }

  /**
   * @returns {Array}
   */
  get samples () {
    const samples = []
    for (const uri of this.mediaUris) {
      samples.push(store.getters['media/sampleByUri'](uri))
    }
    return samples
  }
}

/**
 * A slide.
 */
export class Slide {
  /**
   * @param {module:@bldr/lamp/content-file~rawSlideData} rawSlideData - The
   *   raw slide data from the YAML file as an object.
   */
  constructor (rawSlideData) {
    rawSlideData = convertPropertiesCase(rawSlideData, 'snake-to-camel')

    /**
     * A deep copy of the raw slide data.
     *
     * @type {Object}
     */
    this.rawData = deepCopy(rawSlideData)

    const rawSlideObject = new RawSlideObject(rawSlideData)
    /**
     * The slide number
     * @type {Number}
     */
    this.no = null

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
     * @type {module:@bldr/lamp/masters~Master}
     */
    this.master = masters.get(this.masterName)

    /**
     * Data in various types to pass to a master slide.
     * Normalized master data. This data gets passed through the master slides,
     * to the props of the Vue components.
     * @type {module:@bldr/core/masters~rawMasterData}
     */
    this.props = rawSlideObject.cut(this.masterName)

    /**
     * Props (properties) to send to the main Vue master component.
     */
    this.propsMain = null

    /**
     * Props (properties) to send to the preview Vue master component.
     */
    this.propsPreview = null

    /**
     * A list of media URIs.
     *
     * @type {array}
     */
    this.mediaUris = []

    const normalizedProps = this.master.normalizeProps(this.props)
    if (normalizedProps) {
      this.props = normalizedProps
    }
    this.master.detectUnkownProps(this.props)
    this.master.markupToHtml(this.props)
    this.master.validateUris(this.props)

    const mediaUris = this.master.resolveMediaUris(this.props)
    if (mediaUris) this.mediaUris = mediaUris

    /**
     * How many steps the slide provides.
     *
     * @type {number}
     */
    this.stepCount = null

    /**
     * The current step number. The first number is 1 not 0.
     *
     * @type {number}
     */
    this.stepNo = null

    /**
     * The slide steps.
     *
     * @type {module:@bldr/lamp/steps~SlideStep[]}
     */
    this.steps = null

    /**
     * @type {module:@bldr/lamp/content-file.MetaData}
     */
    this.metaData = new MetaData(rawSlideObject)

    const style = rawSlideObject.cut('style')
    if (style) {
      normalizeStyle(style)
    }

    /**
     * Css properties in camelCase for the style property of the vue js
     * render function.
     *
     * ```yml
     * - title: Different background color
     *   task: Background color blue
     *   style:
     *     background_color: $green;
     *     color: $blue;
     *     font_size: 8vw
     *     font_weight: bold
     * ```
     *
     * @see {@link https://vuejs.org/v2/guide/class-and-style.html#Object-Syntax-1}
     *
     * @type {Object}
     */
    this.style = style

    /**
     * A list of child slide objects.
     *
     * @type {Array}
     */
    this.slides = []

    /**
     * The level in the hierarchial slide tree.
     *
     * @type {Number}
     */
    this.level = 1

    /**
     * @type {module:@bldr/lamp/content-file~AudioOverlay}
     */
    this.audioOverlay = null

    /**
     * @type {Number}
     */
    this.scaleFactor = 1

    const audioOverlay = rawSlideObject.cut('audioOverlay')
    if (audioOverlay) {
      this.audioOverlay = new AudioOverlay(audioOverlay)
    }

    if (!rawSlideObject.isEmpty()) {
      throw Error(`Unknown slide properties: ${toString(rawSlideObject.raw)}`)
    }
  }

  /**
   * A value to identify a slide. The ID (from `slide.metaData.id`) of this
   * slide or the number (the same as `slide.no`) of this slide.
   *
   * @type {String}
   */
  get id () {
    if (this.metaData.id) {
      return this.metaData.id
    }
    // else if (this.no) {
    //   return this.no
    // }
  }

  /**
   * The title of this slide.
   *
   * @type {String}
   */
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
   * @type {String}
   */
  get plainText () {
    const output = []
    const fromProps = this.master.plainTextFromProps(this.props)
    if (fromProps) output.push(fromProps)
    for (const mediaFile of this.mediaFiles) {
      output.push(mediaFile.plainText)
    }
    return output.join(' | ')
  }

  /**
   * The media files of this slide as an array.
   *
   * @type {Array}
   */
  get mediaFiles () {
    const mediaFiles = []
    for (const mediaUri of this.mediaUris) {
      mediaFiles.push(store.getters['media/mediaFileByUri'](mediaUri))
    }
    return mediaFiles
  }

  /**
   * The name of the content theme of this slide.
   *
   * @type {String}
   */
  get contentTheme () {
    if (this.master.styleConfig.contentTheme) {
      return this.master.styleConfig.contentTheme
    } else {
      return 'default'
    }
  }

  /**
   * The property `rawData` converted back into yaml.
   *
   * @type {String}
   */
  get yamlMarkup () {
    const markup = yaml.safeDump(this.rawData, jsYamlConfig)
    return escapeHtml(markup)
  }

  /**
   * The URI of the first media file. To be able to edit single media files
   * in a presentation (open parent folder or edit the info yml file in
   * the editor.)
   *
   * @type {String}
   */
  get firstMediaUri () {
    if (this.mediaUris && this.mediaUris.size) {
      return this.mediaUris.values().next().value
    }
  }

  /**
   * Get an object that can be submitted to `router.push()` to view the current
   * slide.
   *
   * @params {String} - `public` or `speaker`
   *
   * @returns {Object}
   */
  routerLocation (view = 'public') {
    const routeNames = views[view]
    const presentation = store.getters['lamp/presentation']
    let name
    const params = { presId: presentation.id }
    if (this.stepCount && this.stepCount > 1) {
      name = routeNames.stepNo
      if (this.stepNo) {
        params.stepNo = this.stepNo
      } else {
        params.stepNo = 1
      }
    } else {
      name = routeNames.slideNo
    }
    if (this.id) {
      params.slideNo = this.id
    } else {
      params.slideNo = this.no
    }
    return { name, params }
  }
}

/**
 * Parse the slide objects in a recursive fashion. Child slides can be specified
 * under the `slides` property.
 *
 * @param {Array} slidesRaw - The raw slide array from the YAML presentation
 *  file, the slides property.
 * @param {Array} slidesFlat - A array which is filled with every slide object.
 * @param {Array} slidesTree - A array which is filled with only top level slide
 *   objects.
 * @param {Number} level - The level in the hierachial tree the slide lies in 1:
 *   Main level, 2: First child level ...
 */
function parseSlidesRecursive (slidesRaw, slidesFlat, slidesTree, level = 1) {
  for (const slideRaw of slidesRaw) {
    if (slideRaw.state !== 'absent') {
      const childSlides = slideRaw.slides
      delete slideRaw.slides
      const slide = new Slide(slideRaw)
      slidesFlat.push(slide)
      slidesTree.push(slide)
      slide.no = slidesFlat.length
      slide.level = level
      if (childSlides && Array.isArray(childSlides)) {
        parseSlidesRecursive(childSlides, slidesFlat, slide.slides, level + 1)
      }
    }
  }
}

/**
 * A presentation
 *
 * @property {String} path
 * @property {String} parentDir
 * @property {object} meta
 * @property {object} slides
 * @property {object} media
 * @property {string} rawYamlString_
 * @property {string} rawYamlObject_
 */
export class Presentation {
  /**
   * Go to a certain slide by ID.
   *
   * @param {Number} slideId - The ID of a slide.
   */
  goto (slideId) {
    const slideNo = this.store.getters['lamp/nav/slideNoById'](slideId)
    const slide = this.slides[slideNo - 1]
    router.push(slide.routerLocation)
  }

  /**
   * Some meta data fields are only available in the mongodb object, for
   * example the path of the presentation. We prefer the object fetched
   * over axios from the HTTP media server to be able to update the
   * presentations without updating the whole mongo db. This fields are
   * merged from the mongodb object:
   *
   *
   * ```js
   * this.path
   * this.parentDir
   * this.meta.id
   * this.meta.title
   * this.meta.subtitle
   * this.meta.grade
   * this.meta.curriculum
   * ```
   *
   * @param {Object} presentationMongo
   */
  mergeFromMongo (presentation) {
    if ('path' in presentation) {
      this.path = presentation.path
      const fileName = presentation.path.split('/').pop()
      this.parentDir = presentation.path.replace(`/${fileName}`, '')
    }

    if ('meta' in presentation) {
      const meta = presentation.meta
      if (!this.meta) this.meta = {}
      for (const key of ['id', 'title', 'subtitle', 'curriculum', 'grade']) {
        if (!this.meta[key] && meta[key]) {
          this.meta[key] = meta[key]
        }
      }
    }
  }

  /**
   * Convert a YAML string into a Javascript object. Normalize properties.
   * Parse slides recursive. Add a placeholder slide if the presentation is
   * empty.
   *
   * @param {String} rawYamlString
   */
  async parseYamlFile (rawYamlString) {
    this.rawYamlString_ = rawYamlString
    try {
      this.rawYamlObject_ = yaml.safeLoad(rawYamlString)
    } catch (error) {
      throw new Error(`${error.name}: ${error.message}`)
    }

    if (!this.rawYamlObject_) {
      this.rawYamlObject_ = {
        meta: null,
        slides: [
          {
            title: 'Die Präsentation hat noch keine Folien',
            generic: 'Die Präsentation hat noch keine Folien'
          }
        ]
      }
    } else if (!this.rawYamlObject_.slides) {
      throw new Error(
        `No top level slides key found!

---
slides:
- generic: etc.

Can not parse this content:

${JSON.stringify(this.rawYamlObject_)}`
      )
    }

    /**
     * A flat list of slide objects. All child slides are included in this
     * array.
     *
     * @type {Array}
     */
    this.slides = []

    /**
     * Only the top level slide objects are included in this array. Child slides
     * can be accessed under the `slides` property.
     *
     * @type {Array}
     */
    this.slidesTree = []

    // In this function call the `Slide()` objects are created.
    parseSlidesRecursive(this.rawYamlObject_.slides, this.slides, this.slidesTree)

    // This function is also called inside the function `parseSlidesRecursive()`
    this.rawYamlObject_ = convertPropertiesCase(this.rawYamlObject_, 'snake-to-camel')

    // Async hooks to load resources in the background.
    for (const slide of this.slides) {
      slide.master.afterLoading(slide.props, vue)
    }

    /**
     * The meta object.
     *
     * ```yaml
     * meta:
     *   title: A title
     *   id: An unique id
     *   grade: The grade the presentation belongs to.
     *   curriculum: Relation to the curriculum.
     * ```
     *
     * @type {object}
     * @property {String} id - An unique id.
     * @property {String} title - The title of the presentation.
     * @property {String} subtitle - The subtitle of the presentation.
     * @property {String} grade - The grade the presentation belongs to.
     * @property {String} curriculum - Relation to the curriculum.
     * @property {String} curriculum_url - URL of the curriculum web page.
     */
    this.meta = this.rawYamlObject_.meta

    // Resolve all media files.
    const mediaUris = []
    for (const slide of this.slides) {
      for (const mediaUri of slide.mediaUris) {
        mediaUris.push(mediaUri)
      }
      if (slide.audioOverlay) {
        for (const mediaUri of slide.audioOverlay.mediaUris) {
          mediaUris.push(mediaUri)
        }
      }
    }
    if (mediaUris.length > 0) {
      /**
       * @type {Object}
       */
      this.media = await vue.$media.resolve(mediaUris)
    }

    // After media resolution.
    for (const slide of this.slides) {
      await slide.master.afterMediaResolution(slide.props, vue)
    }

    for (const slide of this.slides) {
      slide.master.renderInlineMedia(slide.props)
      slide.propsMain = slide.master.collectPropsMain(slide.props, vue)
      slide.propsPreview = slide.master.collectPropsPreview(
        {
          props: slide.props,
          propsMain: slide.propsMain,
          slide
        },
        vue
      )
      const steps = slide.master.calculateStepCount({
        props: slide.props,
        propsMain: slide.propsMain,
        propsPreview: slide.propsPreview,
        slide,
        master: slide.master
      }, vue)
      if (Number.isInteger(steps)) {
        slide.stepCount = steps
      } else if (Array.isArray(steps)) {
        slide.stepCount = steps.length
        slide.steps = steps
      }
    }

    store.dispatch('lamp/nav/initNavList', this.slides)
  }

  /**
   * The title of the presentation specified in:
   *
   * ```yml
   * meta:
   *   title: My Title
   * ```
   *
   * @returns {String}
   */
  get title () {
    if (this.meta && this.meta.title) return this.meta.title
  }

  /**
   * The subtitle of the presentation specified in:
   *
   * ```yml
   * meta:
   *   subtitle: My Title
   * ```
   *
   * @returns {String}
   */
  get subtitle () {
    if (this.meta && this.meta.subtitle) return this.meta.subtitle
  }

  /**
   * The ID of the presentation
   *
   * ```yml
   * meta:
   *   id: My-Presentation
   * ```
   *
   * @returns {String}
   */
  get id () {
    if (this.meta && this.meta.id) return this.meta.id
  }

  /**
   * The grade the presentation belongs to.
   *
   * ```yml
   * meta:
   *   grade: 7
   * ```
   *
   * @returns {String}
   */
  get grade () {
    if (this.meta && this.meta.grade) return this.meta.grade
  }

  /**
   * Relation to the curriculum.
   *
   * ```yml
   * meta:
   *   curriculum: Relation to the curriculum
   * ```
   *
   * @returns {String}
   */
  get curriculum () {
    if (this.meta && this.meta.curriculum) return this.meta.curriculum
  }

  /**
   * Navigate through the slides (skiping the steps) by updating the route.
   *
   * @param {Number} direction - `1`: next, `-1`: previous
   */
  nextSlide (direction) {
    const slide = store.getters['lamp/slide']
    const slides = store.getters['lamp/slides']
    const slidesCount = store.getters['lamp/slidesCount']

    const params = { presId: this.id }

    // next
    if (direction === 1 && slide.no === slidesCount) {
      params.slideNo = 1
    // previous
    } else if (direction === -1 && slide.no === 1) {
      params.slideNo = slidesCount
    } else {
      params.slideNo = slide.no + direction
    }

    // next
    if (direction === 1) {
      store.dispatch('lamp/highlightCursorArrow', 'right')
    // previous
    } else if (direction === -1) {
      store.dispatch('lamp/highlightCursorArrow', 'left')
    }

    const slideNext = slides[params.slideNo - 1]

    if (slideNext.stepCount > 1) {
      params.stepNo = 1
    }

    const name = getNavRouteNameFromRoute(params, router.currentRoute)

    router.push({ name, params })
  }

  /**
   * Navigate through the steps of a slide by updating the route.
   *
   * @param {Number} direction - `1`: next, `-1`: previous
   */
  nextStep (direction) {
    const slide = store.getters['lamp/slide']

    if (!slide.stepCount || slide.stepCount < 2) return

    const params = {
      presId: this.id,
      slideNo: slide.no
    }

    // next
    if (direction === 1 && slide.stepNo === slide.stepCount) {
      params.stepNo = 1
    // previous
    } else if (direction === -1 && slide.stepNo === 1) {
      params.stepNo = slide.stepCount
    } else {
      params.stepNo = slide.stepNo + direction
    }

    // next
    if (direction === 1) {
      store.dispatch('lamp/highlightCursorArrow', 'down')
    // previous
    } else if (direction === -1) {
      store.dispatch('lamp/highlightCursorArrow', 'up')
    }

    router.push({ name: 'slide-step-no', params })
  }

  /**
   * Navigate through the presentation by updating the route.
   *
   * @param {Number} direction - `1`: next, `-1`: previous
   */
  nextSlideOrStep (direction) {
    const params = store.getters['lamp/nav/nextRouterParams'](direction)
    params.presId = this.id

    const name = getNavRouteNameFromRoute(params, router.currentRoute)

    // next
    if (direction === 1) {
      if (params.stepNo && params.stepNo !== 1) {
        store.dispatch('lamp/highlightCursorArrow', 'down')
      } else {
        store.dispatch('lamp/highlightCursorArrow', 'right')
      }
    // previous
    } else if (direction === -1) {
      if (params.stepNo && params.stepNo !== store.getters['lamp/slide'].stepCount) {
        store.dispatch('lamp/highlightCursorArrow', 'up')
      } else {
        store.dispatch('lamp/highlightCursorArrow', 'left')
      }
    }

    router.push({ name, params })
  }

  toggleSpeakerView () {
    const route = router.currentRoute
    let name
    const params = route.params
    if (route.name === 'slide') {
      name = 'speaker-view'
    } else if (route.name === 'slide-step-no') {
      name = 'speaker-view-step-no'
    } else if (route.name === 'slides-preview') {
      name = 'speaker-view'
      if (!params.slideNo) {
        params.slideNo = 1
        delete params.stepNo
      }
    } else if (route.name === 'speaker-view') {
      name = 'slide'
    } else if (route.name === 'speaker-view-step-no') {
      name = 'slide-step-no'
    }
    if (name) router.push({ name, params: route.params })
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
    const reader = new FileReader()
    reader.readAsText(file, 'utf-8')
    reader.onload = readerEvent => {
      const content = readerEvent.target.result
      store.dispatch('lamp/openPresentation', content).then(() => {
        if (router.currentRoute.name !== 'slide') router.push({ name: 'slide' })
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
