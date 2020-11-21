
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
   * this.meta.id
   * this.meta.title
   * this.meta.subtitle
   * this.meta.grade
   * this.meta.curriculum
   * ```
   */
  constructor ({ rawYamlString, rawObject }) {
    // Load the YAML string. Convert the YAML string into a object.
    let rawYamlObject
    if (rawYamlString) {
      try {
        if (rawObject && rawObject.meta && rawObject.meta.id) {
          rawYamlString = this.expandMediaUris(rawYamlString, rawObject.meta.id)
        }
        rawYamlObject = yaml.safeLoad(rawYamlString)
      } catch (error) {
        throw new Error(`${error.name}: ${error.message}`)
      }

      if (!rawYamlObject) {
        rawYamlObject = {
          meta: null,
          slides: [
            {
              title: 'Die Präsentation hat noch keine Folien',
              generic: 'Die Präsentation hat noch keine Folien'
            }
          ]
        }
      } else if (!rawYamlObject.slides) {
        throw new Error(`No top level slides key found!\n\n---\nslides:\n- generic: etc.\n\nCan not parse this content:\n\n${JSON.stringify(rawYamlObject)}`)
      }
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
    this.meta = rawYamlObject.meta

    if (rawObject && rawObject.path) {
      /**
       * The relative path of the presentation, for example
       * `12/20_Tradition/10_Umgang-Tradition/10_Futurismus/Praesentation.baldr.yml`.
       *
       * @type {String}
       */
      this.path = rawObject.path
      const fileName = rawObject.path.split('/').pop()

      /**
       * The relative path of parent directory, for example
       * `12/20_Tradition/10_Umgang-Tradition/10_Futurismus`.
       *
       * @type {String}
       */
      this.parentDir = rawObject.path.replace(`/${fileName}`, '')
    }

    if (rawObject && rawObject.meta) {
      const meta = rawObject.meta
      if (!this.meta) this.meta = {}
      for (const key of ['id', 'title', 'subtitle', 'curriculum', 'grade']) {
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
    parseSlidesRecursive(rawYamlObject.slides, this.slides, this.slidesTree)

    // This function is also called inside the function `parseSlidesRecursive()`
    rawYamlObject = convertPropertiesSnakeToCamel(rawYamlObject)

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
      if (slide.audioOverlay) {
        for (const mediaUri of slide.audioOverlay.mediaUris) {
          mediaUris.push(mediaUri)
        }
      }
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
   * URI `id:Leitmotivtechnik_VD_Verdeutlichung_Duell-Mundharmonika-Frank` can
   * be shortend with `id:./VD_Verdeutlichung_Duell-Mundharmonika-Frank`. The
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
    return rawYamlString.replace(/id:.\//g, `id:${presentationId}_`)
  }

  /**
   * Resolve the media assets associated with the presentation. This have to be
   * done asynchronously, therefore it can’t be accomplished in the constructor.
   */
  async resolveMedia () {
    if (this.parentDir) {
      // Problems with multipart selections.
      // await vm.$media.resolveByParentDir(this.parentDir)
    }
    if (this.mediaUris.length > 0) {
      /**
       * @type {Object}
       */
      this.media = await vm.$media.resolve(this.mediaUris, true) // throw exceptions.
    }

    if (this.optionalMediaUris.length > 0) {
      await vm.$media.resolve(this.optionalMediaUris, false) // throw no exceptions.
    }

    // After media resolution.
    for (const slide of this.slides) {
      await slide.master.afterMediaResolution(slide.props, vm)
    }

    for (const slide of this.slides) {
      slide.master.renderInlineMedia(slide.props)
      slide.propsMain = slide.master.collectPropsMain(slide.props, vm)
      slide.propsPreview = slide.master.collectPropsPreview(
        {
          props: slide.props,
          propsMain: slide.propsMain,
          slide
        },
        vm
      )
      const steps = slide.master.calculateStepCount({
        props: slide.props,
        propsMain: slide.propsMain,
        propsPreview: slide.propsPreview,
        slide,
        master: slide.master
      }, vm)
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
}
