/**
 * Parse, process and validate the presentation content file (YAML).
 *
 * @module @bldr/lamp/content-file
 */

import {
  convertFromYamlRaw,
  convertPropertiesSnakeToCamel
} from '@bldr/yaml'
import {
  convertToString,
  deepCopy,
  RawDataObject
} from '@bldr/universal-utils'
import { shortenText } from '@bldr/string-format'
import { convertMarkdownToHtml } from '@bldr/markdown-to-html'
import { masters } from '@/masters.js'
import store from '@/store/index.js'
import { router } from '@/lib/router-setup'
import { routerViews } from '@/lib/routing-related'
import vm from '@/main'
import { resolver } from '@bldr/presentation-parser'

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
  return array1.filter(n => array2.includes(n))
}

async function addAssetsNgToStore (uris, throwException = true) {
  const assets = await resolver.resolve(uris, throwException)
  for (const asset of assets) {
    store.commit('lamp/media/addAsset', asset)
  }
  const samples = resolver.exportSamples()
  for (const sample of samples) {
    store.commit('lamp/media/addSample', sample)
  }
  return assets
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
      throw Error(
        `Unsupported input type “${getType(
          rawData
        )}” on input data: ${convertToString(rawData)}`
      )
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
    this.ref = this.grabProperty_('ref')

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
    if (text) return convertMarkdownToHtml(text)
    return null
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
    rawSlideData = convertPropertiesSnakeToCamel(rawSlideData)

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
      throw Error(
        `No master slide found: ${convertToString(rawSlideObject.raw)}`
      )
    }

    if (intersection.length > 1) {
      throw Error(
        `Each slide must have only one master slide: ${convertToString(
          rawSlideObject.raw
        )}`
      )
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
    this.master.convertMarkdownToHtml(this.props)
    this.master.validateUris(this.props)

    const mediaUris = this.master.resolveMediaUris(this.props)
    if (mediaUris) this.mediaUris = mediaUris

    this.texMarkup = null

    /**
     * Media URIs that do not have to exist.
     *
     * @type {Array}
     */
    this.optionalMediaUris = []
    const optionalMediaUris = this.master.resolveOptionalMediaUris(this.props)
    if (optionalMediaUris) this.optionalMediaUris = optionalMediaUris

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
      this.audioOverlay = audioOverlay
    }
  }

  /**
   * A value to identify a slide. The ID (from `slide.metaData.ref`) of this
   * slide or the number (the same as `slide.no`) of this slide.
   *
   * @type {String}
   */
  get ref () {
    if (this.metaData.ref) {
      return this.metaData.ref
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
    const titleFromProps = this.master.titleFromProps({
      props: this.props,
      propsMain: this.propsMain,
      propsPreview: this.propsPreview
    })

    if (titleFromProps) return titleFromProps

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
    if (fromProps) {
      output.push(fromProps)
    }
    for (const asset of this.assets) {
      if (asset != null) {
        output.push(asset.plainText)
      }
    }
    return output.join(' | ')
  }

  /**
   * The media files of this slide as an array.
   *
   * @type {Array}
   */
  get assets () {
    const assets = []
    for (const mediaUri of this.mediaUris) {
      assets.push(store.getters['lamp/media/assetByUri'](mediaUri))
    }
    return assets
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
    const routeNames = routerViews[view]
    const presentation = store.getters['lamp/presentation']
    let name
    const params = { presRef: presentation.ref }
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
    params.slideNo = this.no
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
 * Normalize properties. Parse slides recursive. Add a placeholder slide if the
 * presentation is empty.
 */
export class Presentation {
  /**
   * @param {Object} presData
   *
   * @property {String} rawYamlString - The YAML string is converted into a
   * Javascript object.
   *
   * @property {Object} rawObject - Some meta data fields are only available in
   * the mongodb object, for example the path of the presentation. We prefer the
   * object fetched over axios from the HTTP media server to be able to update
   * the presentations without updating the whole mongo db. This fields are
   * merged from the mongodb object:
   *
   * ```js
   * this.path
   * this.parentDir
   * this.meta.ref
   * this.meta.title
   * this.meta.subtitle
   * this.meta.grade
   * this.meta.curriculum
   * ```
   */
  constructor (rawYamlString) {
    // Load the YAML string. Convert the YAML string into a object.
    let rawObject = convertFromYamlRaw(rawYamlString)
    const ref = rawObject.ref != null ? rawObject.ref : rawObject.meta.ref
    rawYamlString = this.expandMediaUris(rawYamlString, ref)
    rawObject = convertFromYamlRaw(rawYamlString)

    /**
     * The meta object.
     *
     * ```yaml
     * meta:
     *   title: A title
     *   ref: An unique id
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
    this.meta = rawObject.meta != null ? rawObject.meta : {}

    if (rawObject.meta && rawObject.meta.path) {
      /**
       * The relative path of the presentation, for example
       * `12/20_Tradition/10_Umgang-Tradition/10_Futurismus/Praesentation.baldr.yml`.
       *
       * @type {String}
       */
      this.path = rawObject.meta.path
      const fileName = rawObject.meta.path.split('/').pop()

      /**
       * The relative path of parent directory, for example
       * `12/20_Tradition/10_Umgang-Tradition/10_Futurismus`.
       *
       * @type {String}
       */
      this.parentDir = rawObject.meta.path.replace(`/${fileName}`, '')
    }

    if (rawObject.meta != null) {
      const meta = rawObject.meta
      for (const key of ['ref', 'title', 'subtitle', 'curriculum', 'grade']) {
        if (!this.meta[key] && meta[key]) {
          this.meta[key] = meta[key]
        }
      }
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
    parseSlidesRecursive(rawObject.slides, this.slides, this.slidesTree)

    // This function is also called inside the function `parseSlidesRecursive()`
    rawObject = convertPropertiesSnakeToCamel(rawObject)

    // Async hooks to load resources in the background.
    for (const slide of this.slides) {
      slide.master.afterLoading(slide.props, vm)
    }

    // Resolve all media files.
    const mediaUris = []
    const optionalMediaUris = []
    for (const slide of this.slides) {
      for (const mediaUri of slide.mediaUris) {
        mediaUris.push(mediaUri)
      }
      for (const mediaUri of slide.optionalMediaUris) {
        optionalMediaUris.push(mediaUri)
      }
      // if (slide.audioOverlay) {
      //   for (const mediaUri of slide.audioOverlay.mediaUris) {
      //     mediaUris.push(mediaUri)
      //   }
      // }
    }

    /**
     * All collected media URIs of the presentation.
     *
     * @type {Array}
     */
    this.mediaUris = mediaUris

    /**
     * Media URIs that do not have to exist.
     *
     * @type {Array}
     */
    this.optionalMediaUris = optionalMediaUris
  }

  /**
   * Media URIs can be shorted with the string `./`. The abbreviationn `./` is
   * replaced with the presentation ID and a underscore, for example the media
   * URI `ref:Leitmotivtechnik_VD_Verdeutlichung_Duell-Mundharmonika-Frank` can
   * be shortend with `ref:./VD_Verdeutlichung_Duell-Mundharmonika-Frank`. The
   * abbreviationn `./` is inspired by th UNIX dot notation for the current
   * directory.
   *
   * @param {string} rawYamlString - The raw YAML string of presentations
   *   content file.
   * @param {string} presentationId - The ID of the presentation.
   *
   * @returns {string} A raw YAML string with fully expanded media URIs.
   */
  expandMediaUris (rawYamlString, presentationId) {
    return rawYamlString.replace(/ref:.\//g, `ref:${presentationId}_`)
  }

  /**
   * Resolve the media assets associated with the presentation. This have to be
   * done asynchronously, therefore it can’t be accomplished in the constructor.
   */
  async resolveMedia (vmExternal) {
    const vmInternal = vm == null ? vmExternal : vm
    if (this.parentDir) {
      // Problems with multipart selections.
      // await vm.$media.resolveByParentDir(this.parentDir)
    }
    if (this.mediaUris.length > 0) {
      /**
       * @type {Object}
       */
      this.media = await addAssetsNgToStore(this.mediaUris)
      // this.media = await vmInternal.$media.resolve(this.mediaUris, true) // throw exceptions.
    }

    if (this.optionalMediaUris.length > 0) {
      await addAssetsNgToStore(this.optionalMediaUris, false)
      // await vmInternal.$media.resolve(this.optionalMediaUris, false) // throw no exceptions.
    }

    // After media resolution.
    for (const slide of this.slides) {
      await slide.master.afterMediaResolution(slide.props, vmInternal)
    }

    for (const slide of this.slides) {
      slide.master.renderInlineMedia(slide.props)
      slide.propsMain = slide.master.collectPropsMain(slide.props, vmInternal)
      slide.propsPreview = slide.master.collectPropsPreview(
        {
          props: slide.props,
          propsMain: slide.propsMain,
          slide
        },
        vmInternal
      )
      slide.texMarkup = slide.master.generateTexMarkup(
        {
          props: slide.props,
          propsMain: slide.propsMain,
          propsPreview: slide.propsPreview
        },
        vmInternal
      )
      const steps = slide.master.calculateStepCount(
        {
          props: slide.props,
          propsMain: slide.propsMain,
          propsPreview: slide.propsPreview,
          slide,
          master: slide.master
        },
        vmInternal
      )
      if (Number.isInteger(steps)) {
        slide.stepCount = steps
      } else if (Array.isArray(steps)) {
        slide.stepCount = steps.length + 1
        slide.steps = steps
      }
    }

    store.dispatch('lamp/nav/initNavList', this.slides)
  }

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
   *   ref: My-Presentation
   * ```
   *
   * @returns {String}
   */
  get ref () {
    if (this.meta && this.meta.ref) return this.meta.ref
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
}
