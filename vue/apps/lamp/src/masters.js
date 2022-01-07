/**
 * Gather informations about all masters.
 *
 * @module @bldr/lamp/masters
 */

/* globals rawYamlExamples */

import { convertNestedMarkdownToHtml } from '@bldr/markdown-to-html'
import inlineMarkup from './lib/inline-markup'
import store from './store/index.js'
import { convertToString } from '@bldr/core-browser'
import { MediaUri } from '@bldr/client-media-models'

/**
 * Container for all registered master slides.
 */
export class MasterCollection {
  constructor () {
    /**
     * A container object for all master objects.
     */
    this.masters = {}
  }

  /**
   * Add a master to the masters container.
   */
  add (master) {
    this.masters[master.name] = master
  }

  /**
   * Get a master object by the master name.
   *
   * @param name - The name of the master slide.
   */
  get (name) {
    if (this.masters[name] == null) {
      throw new Error(`Class Masters.get(): No master named “${name}”`)
    }
    const m = this.masters[name]
    return m
  }

  /**
   * Get all master objects as an object with the master name as properties.
   *
   * @returns {object}
   */
  get all () {
    return this.masters
  }

  /**
   * Get all master names as an array.
   */
  get allNames () {
    return Object.keys(this.masters)
  }

  /**
   * Check if a master exist.
   *
   * @param name - The name of the master slide.
   */
  exists (name) {
    return this.masters[name] != null
  }

  /**
   * Find the name of the master by getting the intersection between all master
   * names and the slide keys.
   *
   * This method can be used to check that a slide object uses only one master
   * slide.
   *
   * @param data - The raw object of one slide unmodified from the YAML file.
   *
   * @returns An instance of the master.
   *
   * @throws If no master can be found and if more than one master name are
   * found.
   */
  findMaster (data) {
    const rawProperties = Object.keys(data)
    const intersection = this.allNames.filter(masterName =>
      rawProperties.includes(masterName)
    )
    if (intersection.length === 0) {
      throw Error(`No master slide found: ${convertToString(data)}`)
    }
    if (intersection.length > 1) {
      throw Error(
        `Each slide must have only one master slide: ${convertToString(data)}`
      )
    }
    return this.get(intersection[0])
  }
}

export const masterCollection = new MasterCollection()

/**
 * The icon of a master slide. This icon is shown in the documentation or
 * on the left corner of a slide.
 */
class MasterIcon {
  constructor ({ name, color, size, showOnSlides }) {
    if (size && !['small', 'large'].includes(size)) {
      throw new Error(
        `The property “size” of the “MasterIcon” has to be “small” or “large” not ${size}`
      )
    }

    if (showOnSlides !== undefined && typeof showOnSlides !== 'boolean') {
      throw new Error(
        `The property “showOnSlide” of the “MasterIcon” has to be “boolean” not ${showOnSlides}`
      )
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
   * @param {Object} specs - The default exported object from the `main.js`
   * file.
   */
  constructor (specs) {
    /**
     * It is the same as the parent folder where all master files are located,
     * for example `masters/audio/main.js`. The master name is `audio`.
     * @type {string}
     */
    this.name = null

    /**
     * The human readable title of the master slide.
     *
     * @type {String}
     */
    this.title = null

    /**
     * A instance of `MasterIcon` which holds information about the master icon.
     *
     * @type {module:@bldr/lamp/masters~MasterIcon}
     */
    this.icon = null

    /**
     * A style configuration object.
     *
     * @type {module:@bldr/lamp~styleConfig}
     */
    this.styleConfig = null

    /**
     * A vuex object containing `state`, `getters`, `actions`, `mutations`
     * properties which buildes a submodule vuex store for each master.
     *
     * @type {Object}
     */
    this.store = null

    /**
     * The definition of the slide properties (`props`) (aka `props` of a
     * `master`).
     *
     * @type {module:@bldr/lamp~propsDef}
     */
    this.propsDef = null

    /**
     * All imported methods. They are not called directly, but through
     * public methods, which adds additional functionality.
     *
     * @private
     * @type {Object}
     */
    this.hooks_ = {}
    for (const spec in specs) {
      if (spec === 'icon') {
        this.icon = new MasterIcon(specs.icon)
      } else if (spec === 'props') {
        // To avoid confusion between real world prop with real world values
        // and props defintions we choose a different name.
        this.propsDef = specs.props
      } else if (spec === 'hooks') {
        // Make hooks private. Hooks should called from the public wrapper
        // methods.
        this.hooks_ = specs[spec]
      } else {
        this[spec] = specs[spec]
      }
    }
    this.registerVuexModule_()
  }

  /**
   * Generate the name of the Vuex module, e. g. `lamp/masters/camera`.
   *
   * @returns {String}
   * @private
   */
  vuexModuleName_ () {
    return `lamp/masters/${this.name}`
  }

  /**
   * Shortcut function to access the masters Vuex module getter function.
   *
   * @param {String} getterName
   * @param {Mixed} arg
   */
  $get (getterName, arg) {
    getterName = this.vuexModuleName_() + '/' + getterName
    if (arg) {
      return store.getters[getterName](arg)
    } else {
      return store.getters[getterName]
    }
  }

  /**
   * Shortcut function to access the masters Vuex module commit function.
   *
   * @param {String} mutationName
   * @param {Mixed} payload
   */
  $commit (mutationName, payload) {
    mutationName = this.vuexModuleName_() + '/' + mutationName
    store.commit(mutationName, payload)
  }

  /**
   * A example presentation file in the raw YAML format (unparsed). The string
   * is structured like the contents of the `*.baldr.yml` files.
   *
   * @type {String}
   */
  get example () {
    const rawYaml = rawYamlExamples.masters[this.name]
    const prefix =
      '---\n' +
      'meta:\n' +
      `  ref: EP_master_${this.name}\n` +
      `  title: Beispiel-Präsentation für die Master-Folie „${this.name}“\n` +
      '\n'
    return rawYaml.replace('---\n', prefix)
  }

  /**
   * Must called after `this.store` is set.
   *
   * @private
   */
  registerVuexModule_ () {
    if (this.store) {
      this.store.namespaced = true
      store.registerModule(['lamp', 'masters', this.name], this.store)
    }
  }

  /**
   * A cleaned version of `this.example`.
   *
   * Remove the empty line at the beginning of the backtick string example.
   *
   * @returns {String}
   */
  get exampleClean () {
    if (this.example) {
      return this.example.replace(/^\n*/, '')
    }
  }

  /**
   * Call a master hook. Master hooks are definied in the `main.js`
   * files.
   *
   * @param {String} hookName - The name of the master hook / function.
   * @param {mixed} payload - The argument the master hook / function is called
   *   with.
   * @param {object} thisArg - The
   *   {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call thisArg}
   *   the master function is called with.
   *
   * @returns {mixed}
   *
   * @private
   */
  callHook_ (hookName, payload, thisArg) {
    if (this.hooks_[hookName] && typeof this.hooks_[hookName] === 'function') {
      if (thisArg) {
        return this.hooks_[hookName].call(thisArg, payload)
      }
      return this.hooks_[hookName](payload)
    }
  }

  /**
   * Asynchronous version. Call a master hook. Master hooks are definied in the
   * `main.js` files.
   *
   * @param {String} hookName - The name of the master hook / function.
   * @param {mixed} payload - The argument the master hook / function is called
   *   with.
   * @param {object} thisArg - The
   *   {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call thisArg}
   *   the master function is called with.
   *
   * @returns {mixed}
   *
   * @private
   */
  async callHookAsync_ (hookName, payload, thisArg) {
    if (this.hooks_[hookName] && typeof this.hooks_[hookName] === 'function') {
      if (thisArg) {
        return this.hooks_[hookName].call(thisArg, payload)
      }
      return this.hooks_[hookName](payload)
    }
  }

  /**
   * result must fit to props
   *
   * @param {module:@bldr/lamp~props} props
   *
   * @returns {object}
   */
  normalizeProps (props) {
    return this.callHook_('normalizeProps', props)
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
   * @param {object} thisArg - The
   *   {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call thisArg}
   *   the master function is called with.
   *
   * @returns {Number} - The number of steps.
   */
  calculateStepCount (payload, thisArg) {
    return this.callHook_('calculateStepCount', payload, thisArg)
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
        if (match[2] === 'id' || match[2] === 'uuid') uris.add(match[1])
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
      return text.replace(new RegExp(inlineMarkup.regExp, 'g'), function (
        match
      ) {
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
   * (like [id:beethoven, ref:mozart]). Extract media URIs from
   * the text props.
   *
   * @param {module:@bldr/lamp~props} props
   *
   * @returns {Set}
   */
  resolveMediaUris (props) {
    let uris = this.callHook_('resolveMediaUris', props)

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
    let uris = this.callHook_('resolveOptionalMediaUris', props)

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
    return this.callHook_('plainTextFromProps', props)
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
    return this.callHook_('titleFromProps', payload)
  }

  generateTexMarkup (payload) {
    return this.callHook_('generateTexMarkup', payload)
  }

  /**
   * Called when entering a slide.
   *
   * @param {object} payload
   * @property {module:@bldr/lamp/content-file~Slide} payload.oldSlide
   * @property {module:@bldr/lamp~props} payload.oldProps
   * @property {module:@bldr/lamp/content-file~Slide} payload.newSlide
   * @property {module:@bldr/lamp~props} payload.newProps
   *
   * @param {object} thisArg - The
   *   {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call thisArg}
   *   the master function is called with.
   */
  enterSlide (payload, thisArg) {
    this.callHook_('enterSlide', payload, thisArg)
  }

  /**
   * Called when leaving a slide. This hook is triggered by the Vue lifecycle
   * hook `beforeDestroy`.
   *
   * @param {object} payload
   * @property {object} payload
   * @property {module:@bldr/lamp/content-file~Slide} payload.oldSlide
   * @property {module:@bldr/lamp~props} payload.oldProps
   * @property {module:@bldr/lamp/content-file~Slide} payload.newSlide
   * @property {module:@bldr/lamp~props} payload.newProps
   *
   * @param {object} thisArg - The
   *   {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call thisArg}
   *   the master function is called with.
   */
  leaveSlide (payload, thisArg) {
    this.callHook_('leaveSlide', payload, thisArg)
  }

  /**
   * Called when entering a step.
   *
   * @param {object} payload
   * @property {object} payload
   * @property {number} payload.oldStepNo
   * @property {number} payload.newStepNo
   *
   * @param {object} thisArg - The
   *   {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call thisArg}
   *   the master function is called with.
   */
  enterStep (payload, thisArg) {
    return this.callHook_('enterStep', payload, thisArg)
  }

  /**
   * Called when leaving a step.
   *
   * @param {object} payload
   * @property {object} payload
   * @property {number} payload.oldStepNo
   * @property {number} payload.newStepNo
   *
   * @param {object} thisArg - The
   *   {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call thisArg}
   *   the master function is called with.
   */
  leaveStep (payload, thisArg) {
    return this.callHook_('leaveStep', payload, thisArg)
  }

  /**
   * Convert in the props certain strings containing markup to HTML.
   *
   * @param {module:@bldr/lamp~props} props
   *
   * @returns {object}
   */
  convertMarkdownToHtml (props) {
    if (!this.propsDef) return props
    for (const propName in props) {
      const prop = this.propsDef[propName]
      if ('markup' in prop && prop.markup) {
        props[propName] = convertNestedMarkdownToHtml(props[propName])
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
        throw new Error(
          `The master slide “${this.name}” has no property named “${propName}”.`
        )
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
        props[propName] = MediaUri.validate(props[propName])
      }
    }
    return props
  }

  /**
   * Collect the props (properties) for the main Vue component.
   *
   * @param {object} props - The props of the master slide.
   * @param {object} thisArg - The
   *   {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call thisArg}
   *   the master function is called with.
   *
   * @returns {Object} - The props for the main component as a object.
   */
  collectPropsMain (props, thisArg) {
    const propsMain = this.callHook_('collectPropsMain', props, thisArg)
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
   * @param {object} thisArg - The
   *   {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call thisArg}
   *   the master function is called with.
   *
   * @returns {Object} - The props for the preview component as a object.
   */
  collectPropsPreview (payload, thisArg) {
    const propsPreview = this.callHook_('collectPropsPreview', payload, thisArg)
    if (propsPreview) return propsPreview
    if (payload.propsMain) return payload.propsMain
    if (payload.props) return payload.props
  }

  /**
   * Hook after loading. To load resources in the background.
   *
   * @param {Object} props - The properties of the slide.
   * @param {Object} thisArg
   */
  afterLoading (props, thisArg) {
    this.callHook_('afterLoading', { props, master: this }, thisArg)
  }

  /**
   * This hook gets executed after the media resolution. Wait for this hook to
   * finish. Go not in the background.
   *
   * @param {Object} props - The properties of the slide.
   * @param {object} thisArg - The
   *   {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call thisArg}
   *   the master function is called with.
   */
  async afterMediaResolution (props, thisArg) {
    await this.callHookAsync_(
      'afterMediaResolution',
      { props, master: this },
      thisArg
    )
  }
}

function registerMasters () {
  function findMasterName (fileName) {
    const match = fileName.match(/\.\/([\w]+)\/.*/)
    if (!match) {
      throw new Error(`The master name couldn’t be retrieved from ${fileName}”`)
    }
    return match[1]
  }

  const requireMaster = require.context('./masters', true, /.+main\.(js|ts)$/)
  requireMaster.keys().forEach(fileName => {
    // ./masterName/main.js
    const masterName = findMasterName(fileName)
    const masterObj = requireMaster(fileName)
    const masterSpec = masterObj.default
    masterSpec.name = masterName
    const master = new Master(masterSpec)
    masterCollection.add(master)
  })
  return masterCollection
}

/**
 * An instance of the class `Masters()`
 *
 * @type {module:@bldr/lamp/masters~Master}
 */
export const masters = registerMasters()
