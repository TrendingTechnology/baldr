import { MasterTypes } from '@bldr/type-definitions'

/**
 * The
 * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call thisArg}
 * a function is called with.
 */
type ThisArg = object

/**
 * The icon of a master slide. This icon is shown in the documentation or
 * on the left corner of a slide.
 */
class MasterIcon {
  constructor ({ name, color, size, showOnSlides }) {
    if (size && !['small', 'large'].includes(size)) {
      throw new Error(`The property “size” of the “MasterIcon” has to be “small” or “large” not ${size}`)
    }

    if (showOnSlides !== undefined && typeof showOnSlides !== 'boolean') {
      throw new Error(`The property “showOnSlide” of the “MasterIcon” has to be “boolean” not ${showOnSlides}`)
    }
    /**
     * For allowed icon names the materical icon font. The nasizeme of an icon
     * of the {@link module:@bldr/icons baldr icon font}
     *
     * @type {String}
     */
    this.name = name

    /**
     * A color name (CSS color class name) to colorize the master icon.
     * @see {@link module:@bldr/themes}
     *
     * @type {String}
     */
    this.color = color || 'orange'

    /**
     * Show the icon the on slide view.
     *
     * @type {Boolean}
     */
    this.showOnSlides = showOnSlides !== false

    /**
     * `small` or `large`
     *
     * @type {String}
     */
    this.size = size || 'small'
  }
}

/**
 * Each master slide is a instance of this class. This class has many dummy
 * methods. They are there for documentation reasons. On the other side they
 * are useful as default methods. You have not to check if a master slide
 * implements a specific hook.
 */
class Master {

    /**
     * A instance of `MasterIcon` which holds information about the master icon.
     *
     * @type {module:@bldr/lamp/masters~MasterIcon}
     */
    icon: MasterIcon

    /**
     * A style configuration object.
     */
    styleConfig: MasterTypes.StyleConfig

    /**
     * Some markdown formated string to document this master slide.
     */
    documentation?: string

    /**
     * A vuex object containing `state`, `getters`, `actions`, `mutations`
     * properties which buildes a submodule vuex store for each master.
     */
    store: object

    /**
     * The definition of the slide properties (`props`) (aka `props` of a
     * `master`).
     */
    propsDef: MasterTypes.PropsDefintion

    private spec: MasterTypes.MasterSpec

  /**
   * @param spec - The default exported object from the `main.js`
   * file.
   */
  constructor (spec: MasterTypes.MasterSpec) {
    this.spec = spec
  }

  /**
   * The short name of the master slide. Should be a shorter string without
   * spaces in the camelCase format.
   */
  get name(): string {
    return this.spec.name
  }

  /**
   * The human readable title of the master slide.
   */
  get title(): string {
    return this.spec.name
  }

  /**
   * Call a master hook. Master hooks are definied in the `main.js`
   * files.
   *
   * @param hookName - The name of the master hook / function.
   * @param payload - The argument the master hook / function is called
   *   with.
   */
  private callHook (hookName: string, payload: any, thisArg?: ThisArg): any {
    if (this.spec.hooks && this.spec.hooks[hookName] && typeof this.spec.hooks[hookName] === 'function') {
      if (thisArg) {
        return this.spec.hooks[hookName].call(thisArg, payload)
      }
      return this.spec.hooks[hookName](payload)
    }
  }

  /**
   * Asynchronous version. Call a master hook. Master hooks are definied in the
   * `main.js` files.
   *
   * @param hookName - The name of the master hook / function.
   * @param payload - The argument the master hook / function is called
   *   with.
   */
  private async callHookAsync (hookName: string, payload: any, thisArg?: ThisArg): Promise<any> {
    if (this.spec.hooks && this.spec.hooks[hookName] && typeof this.spec.hooks[hookName] === 'function') {
      if (thisArg) {
        return this.spec.hooks[hookName].call(thisArg, payload)
      }
      return this.spec.hooks[hookName](payload)
    }
  }

  /**
   * result must fit to props
   *
   * @param {module:@bldr/lamp~props} props
   *
   * @returns {object}
   */
  normalizeProps (props: any) {
    return this.callHook('normalizeProps', props)
  }

  /**
   * Calculate from the given props the step count. This hook method is called
   * after media resolution.
   *
   * @param {module:@bldr/lamp~props} props
   *
   * @param {Object} payload
   * @property {Object} payload.props - The props of the master slide.
   * @property {Object} payload.propsMain - The props of the main Vue component.
   * @property {Object} payload.propsPreview - The props of the preview Vue component.
   * @property {Object} payload.slide - The slide object.
   *
   * @returns {Number} - The number of steps.
   */
  calculateStepCount (payload, thisArg: ThisArg) {
    return this.callHook('calculateStepCount', payload, thisArg)
  }

  /**
   * The name of the props which are supporting inline media (for example
   * `markup`)
   */
  get propNamesInlineMedia () {
    const inlineMarkupProps = []
    for (const propName in this.propsDef) {
      const propDef = this.propsDef[propName]
      if (propDef.inlineMarkup) {
        inlineMarkupProps.push(propName)
      }
    }
    return inlineMarkupProps
  }

  /**
   * Filter the master props for props which are supporting inline media.
   *
   * @param {module:@bldr/lamp~props}
   *
   * @returns {Set}
   */
  extractInlineMediaUris (props) {
    const uris = new Set()
    /**
     * @param {String} text
     */
    function extractUrisInText (text) {
      const matches = text.matchAll(new RegExp(inlineMarkup.regExp, 'g'))
      for (const match of matches) {
        //  12    3            4
        // [((id):(Fuer-Elise))( caption="Für Elise")]
        if (match[2] === 'id') uris.add(match[1])
      }
    }

    for (const propName of this.propNamesInlineMedia) {
      const prop = props[propName]
      if (prop) {
        if (typeof prop === 'string') {
          extractUrisInText(prop)
        // `markup` in `generic` is an array.
        } else if (Array.isArray(prop)) {
          for (const item of prop) {
            extractUrisInText(item)
          }
        }
      }
    }
    return uris
  }

  /**
   * Replace the inline media tags `[id:Beethoven]` in certain props with
   * HTML. This function must be called after the media resolution.
   *
   * @param {module:@bldr/lamp~props}
   */
  renderInlineMedia (props) {
    /**
     * @param {String} text
     */
    function renderOneMediaUri (text) {
      return text.replace(new RegExp(inlineMarkup.regExp, 'g'), function (match) {
        const item = new inlineMarkup.Item(match)
        return inlineMarkup.render(item)
      })
    }

    for (const propName of this.propNamesInlineMedia) {
      const prop = props[propName]
      if (prop) {
        if (typeof prop === 'string') {
          props[propName] = renderOneMediaUri(prop)
        // `markup` in `generic` is an array.
        } else if (Array.isArray(prop)) {
          for (let i = 0; i < prop.length; i++) {
            props[propName][i] = renderOneMediaUri(prop[i])
          }
        }
      }
    }
  }

  /**
   * Retrieve the media URIs which have to be resolved.
   *
   * Call the master funtion `resolveMediaUris` and collect the media URIs.
   * (like [id:beethoven, id:mozart]). Extract media URIs from
   * the text props.
   *
   * @param {module:@bldr/lamp~props} props
   *
   * @returns {Set}
   */
  resolveMediaUris (props) {
    let uris = this.callHook('resolveMediaUris', props)

    // To allow undefined return values of the hooks.
    if (!uris) {
      uris = new Set()
    } else if (typeof uris === 'string') {
      uris = new Set([uris])
    } else if (Array.isArray(uris)) {
      uris = new Set(uris)
    }

    const inlineUris = this.extractInlineMediaUris(props)
    for (const uri of inlineUris) {
      uris.add(uri)
    }

    if (uris.size) return uris
  }

  /**
   * Check if the handed over media URIs can be resolved. Throw no errors, if
   * the media assets are not present. This hook is used in the YouTube master
   * slide. This master slide uses the online version, if no offline video could
   * be resolved.
   *
   * @param {module:@bldr/lamp~props} props
   *
   * @returns {Set}
   */
  resolveOptionalMediaUris (props) {
    let uris = this.callHook('resolveOptionalMediaUris', props)

    // To allow undefined return values of the hooks.
    if (!uris) {
      uris = new Set()
    } else if (typeof uris === 'string') {
      uris = new Set([uris])
    }
    if (uris.size) return uris
  }

  /**
   * @param {module:@bldr/lamp~props} props
   *
   * @returns {String}
   */
  plainTextFromProps (props) {
    return this.callHook('plainTextFromProps', props)
  }

  /**
   * @param {object} payload
   * @property {module:@bldr/lamp~props} payload.props
   * @property {module:@bldr/lamp~props} payload.propsMain
   * @property {module:@bldr/lamp~props} payload.propPreview
   *
   * @returns {String}
   */
  titleFromProps (payload) {
    return this.callHook('titleFromProps', payload)
  }

  /**
   * Convert in the props certain strings containing markup to HTML.
   *
   * @param {module:@bldr/lamp~props} props
   *
   * @returns {object}
   */
  markupToHtml (props) {
    if (!this.propsDef) return props
    for (const propName in props) {
      const prop = this.propsDef[propName]
      if ('markup' in prop && prop.markup) {
        props[propName] = markupToHtml(props[propName])
      }
    }
    return props
  }

  /**
   * Raise an error if there is an unkown prop - a not in the `props` section
   * defined prop.
   *
   * @param {module:@bldr/lamp~props} props
   */
  detectUnkownProps (props) {
    for (const propName in props) {
      if (this.propsDef && !(propName in this.propsDef)) {
        throw new Error(`The master slide “${this.name}” has no property named “${propName}”.`)
      }
    }
  }

  /**
   * Validate all media file URIs in the props of a certain slide.
   *
   * @param {module:@bldr/lamp~props} props
   */
  validateUris (props) {
    if (!this.propsDef) return props
    for (const propName in props) {
      const prop = this.propsDef[propName]
      if ('assetUri' in prop && prop.assetUri) {
        props[propName] = validateUri(props[propName])
      }
    }
    return props
  }

  /**
   * Collect the props (properties) for the main Vue component.
   *
   * @param {object} props - The props of the master slide.
   * @returns {Object} - The props for the main component as a object.
   */
  collectPropsMain (props, thisArg: ThisArg) {
    const propsMain = this.callHook('collectPropsMain', props, thisArg)
    if (propsMain) return propsMain
    if (props) return props
  }

  /**
   * Collect the props (properties) for the preview Vue component.
   *
   * @param {Object} payload
   * @property {Object} payload.props - The props of the master slide.
   * @property {Object} payload.propsMain - The props of the main Vue component.
   *
   * @returns {Object} - The props for the preview component as a object.
   */
  collectPropsPreview (payload, thisArg: ThisArg) {
    const propsPreview = this.callHook('collectPropsPreview', payload, thisArg)
    if (propsPreview) return propsPreview
    if (payload.propsMain) return payload.propsMain
    if (payload.props) return payload.props
  }

  /**
   * Hook after loading. To load resources in the background.
   *
   * @param {Object} props - The properties of the slide.
   */
  afterLoading (props, thisArg: ThisArg) {
    this.callHook('afterLoading', { props, master: this }, thisArg)
  }

  /**
   * This hook gets executed after the media resolution. Wait for this hook to
   * finish. Go not in the background.
   *
   * @param {Object} props - The properties of the slide.
   */
  async afterMediaResolution (props, thisArg: ThisArg) {
    await this.callHookAsync('afterMediaResolution', { props, master: this }, thisArg)
  }

  /**
   * Called when leaving a slide. This hook is triggered by the Vue lifecycle
   * hook `beforeDestroy`.
   */
  leaveSlide (payload: MasterTypes.OldAndNewPropsAndSlide, thisArg: ThisArg): void {
    this.callHook('leaveSlide', payload, thisArg)
  }

  /**
   * Called when entering a slide. This hook is only called on the public master
   * component (the one that is visible for the audience), not on further
   * secondary master components (for example the ad hoc slides or the future
   * slide view in the speakers view.)
   *
   * - `this`: is the Vue instance of the current main master component.
   * - called from within the Vuex store in the file  `store.js`.
   */
  enterSlide (payload: MasterTypes.OldAndNewPropsAndSlide, thisArg: ThisArg):void {
    this.callHook('enterSlide', payload, thisArg)
  }

  /**
   * This hook gets executed after the slide number has changed on the
   * component. Use `const slide = this.$get('slide')` to get the current slide
   * object.
   *
   * - `this`: is the Vue instance of the current main master component.
   * - called from the master component mixin in the file `masters.js`.
   */
  afterSlideNoChangeOnComponent (payload: MasterTypes.OldAndNewPropsAndSlide, thisArg: ThisArg): void {
    this.callHook('afterSlideNoChangeOnComponent', payload, thisArg)
  }

  /**
   * Called when leaving a step. This hook is only called on the public master
   * component (the one that is visible for the audience), not on further
   * secondary master components (for example the ad hoc slides or the future
   * slide view in the speakers view.)
   *
   * - `this`: is the Vue instance of the current main master component.
   * - called from the Vuex action `setStepNoCurrent` in the file `store.js`.
   */
  leaveStep (payload: MasterTypes.OldAndNewStepNo, thisArg: ThisArg) {
    return this.callHook('leaveStep', payload, thisArg)
  }

  /**
   * Called when entering a step. This hook is only called on the public
   * master component (the one that is visible for the audience), not on
   * further secondary master components (for example the ad hoc slides or the
   * future slide view in the speakers view.)
   *
   * - `this`: is the Vue instance of the current main master component.
   * - called from the Vuex action `setStepNoCurrent` in the file `store.js`.
   */
  enterStep (payload: MasterTypes.OldAndNewStepNo, thisArg: ThisArg): void {
    return this.callHook('enterStep', payload, thisArg)
  }

  /**
   * This hook gets executed after the step number has changed on the
   * component.
   *
   * - `this`: is the Vue instance of the current main master component.
   * - called from the master component mixin in the file `masters.js`.
   */
  afterStepNoChangeOnComponent (payload: MasterTypes.OldAndNewStepNoAndSlideNoChange, thisArg: ThisArg): void {
    this.callHook('afterStepNoChangeOnComponent', payload, thisArg)
  }
}

/**
 * Container for all registered master slides.
 */
class MasterCollection {
  constructor () {
    /**
     * A container object for all master objects.
     *
     * @type {Object}
     */
    this.masters_ = {}
  }

  /**
   * Add a master to the masters container.
   *
   * @param {module:@bldr/lamp/masters~Master} master
   */
  add (master) {
    this.masters_[master.name] = master
  }

  /**
   * Get a master object by the master name.
   *
   * @param {string} name - The name of the master slide.
   *
   * @returns {module:@bldr/lamp/masters~Master}
   */
  get (name) {
    if (!(name in this.masters_)) {
      throw new Error(`Class Masters.get(): No master named “${name}”`)
    }
    return this.masters_[name]
  }

  /**
   * Get all master objects as an object with the master name as properties.
   *
   * @returns {object}
   */
  get all () {
    return this.masters_
  }

  /**
   * Get all master names as an array.
   *
   * @returns {Array}
   */
  get allNames () {
    return Object.keys(this.masters_)
  }

  /**
   * Check if a master exist.
   *
   * @param {string} name - The name of the master slide.
   *
   * @returns {Boolean}
   */
  exists (name) {
    if (name in this.masters_) return true
    return false
  }
}
