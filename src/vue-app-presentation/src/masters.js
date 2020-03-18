/**
 * Gather informations about all masters.
 *
 * @module @bldr/vue-app-presentation/masters
 */

/* globals rawYamlExamples */

import vue, { customStore } from '@/main.js'
import Vue from 'vue'
import store from '@/store.js'
import { markupToHtml, validateUri } from '@/lib.js'
import SlidePreviewPlayButton from '@/views/SlidesPreview/PlayButton.vue'

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
     * of the {@link module:@bldr/vue-plugin-material-icon baldr icon font}
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
  constructor (name) {
    /**
     * It is the same as the basename of the Vue component, for example
     * `audio.vue`. The name is `audio`.
     * @type {string}
     */
    this.name = name

    /**
     * The human readable title of the master slide.
     *
     * @type {String}
     */
    this.title = null

    /**
     * A instance of `MasterIcon` which holds information about the master icon.
     *
     * @type {module:@bldr/vue-app-presentation/masters~MasterIcon}
     */
    this.icon = null

    /**
     * A style configuration object.
     *
     * @type {module:@bldr/vue-app-presentation~styleConfig}
     */
    this.styleConfig = null

    /**
     * Some markdown formated string to document this master slide.
     *
     * @type {String}
     */
    this.documentation = null

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
     * @type {@bldr/vue-app-presentation~propsDef}
     */
    this.propsDef = null
  }

  /**
   * A example presentation file in the YAML format like `*.baldr.yml` files
   * featuring the master.
   *
   * @type {String}
   */
  get example () {
    return rawYamlExamples.masters[this.name]
  }

  /**
   * Must called after `this.store` is set.
   *
   * @private
   */
  registerVuexModule_ () {
    if (this.store) {
      this.store.namespaced = true
      store.registerModule(this.name, this.store)
    }
  }

  /**
   * Import non function properties of the master object of the master.vue
   * components.
   *
   * @param {object} master - The default exported object from the `main.js`
   * file.
   */
  importMaster (members) {
    /**
     * The object from the exported `master` property object of the `master.vue`
     * files.
     *
     * @type {object}
     *
     * @private
     */
    this.members_ = members
    for (const member in members) {
      if (member === 'icon') {
        this.icon = new MasterIcon(members.icon)
      } else if (typeof members[member] !== 'function') {
        this[member] = members[member]
      }
    }

    this.registerVuexModule_()
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
   * Call a master function. Master functions are definied in the `master.vue`
   * files. They are members of the exported object called `master`.
   *
   * ```js
   * export const master = {
   *   normalizeProps (props) {
   *     return props
   *   }
   * }
   * ```
   *
   * @param {String} functionName - The name of the master function.
   * @param {mixed} payload - The argument the master function is called with.
   * @param {object} thisArg - The
   *   {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call thisArg}
   *   the master function is called with.
   *
   * @returns {mixed}
   *
   * @private
   */
  callFunction_ (functionName, payload, thisArg) {
    if (functionName in this.members_ && typeof this.members_[functionName] === 'function') {
      if (thisArg) {
        return this.members_[functionName].call(thisArg, payload)
      }
      return this.members_[functionName](payload)
    }
  }

  /**
   * result must fit to props
   *
   * @param {module:@bldr/vue-app-presentation~props} props
   *
   * @returns {object}
   */
  normalizeProps (props) {
    return this.callFunction_('normalizeProps', props)
  }

  /**
   * Calculate from the given props the step count. This hook method is called
   * after media resolution.
   *
   * @param {module:@bldr/vue-app-presentation~props} props
   * @param {object} thisArg - The
   *   {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call thisArg}
   *   the master function is called with.
   *
   * @returns {Number} - The number of steps.
   */
  calculateStepCount (props, thisArg) {
    return this.callFunction_('calculateStepCount', props, thisArg)
  }

  /**
   * Filter the master props for props which are supporting inline media.
   *
   * @param {module:@bldr/vue-app-presentation~props}
   *
   * @returns {Set}
   */
  extractInlineMediaUris (props) {
    const uris = new Set()
    /**
     * @param {String} text
     */
    function extractUrisInText (text) {
      const matches = text.matchAll(/\[(id:[a-zA-Z0-9-_]+)\]/g)
      for (const match of matches) {
        uris.add(match[1])
      }
    }
    const inlineMediaProps = []
    for (const propName in this.propsDef) {
      const propDef = this.propsDef[propName]
      if (propDef.inlineMedia) {
        inlineMediaProps.push(propName)
      }
    }
    for (const propName of inlineMediaProps) {
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
   * An array of media URIs to resolve (like [id:beethoven, filename:mozart.mp3])
   *
   * @param {module:@bldr/vue-app-presentation~props} props
   *
   * @returns {Array}
   */
  resolveMediaUris (props) {
    const inlineUris = this.extractInlineMediaUris(props)
    const uris = this.callFunction_('resolveMediaUris', props)
    // To allow undefined URIs
    if (!uris && !inlineUris.size) return
    const result = []
    if (typeof uris === 'string') {
      result.push(uris)
    } else if (Array.isArray(uris)) {
      for (const uri of uris) {
        if (uri) {
          result.push(uri)
        }
      }
    }
    for (const uri of inlineUris) {
      result.push(uri)
    }
    if (result.length) return result
  }

  /**
   * @param {module:@bldr/vue-app-presentation~props} props
   *
   * @returns {String}
   */
  plainTextFromProps (props) {
    return this.callFunction_('plainTextFromProps', props)
  }

  /**
   * Called when entering a slide.
   *
   * @param {object} payload
   * @property {object} payload
   * @property {module:@bldr/vue-app-presentation/content-file~Slide} payload.oldSlide
   * @property {module:@bldr/vue-app-presentation~props} payload.oldProps
   * @property {module:@bldr/vue-app-presentation/content-file~Slide} payload.newSlide
   * @property {module:@bldr/vue-app-presentation~props} payload.newProps
   *
   * @param {object} thisArg - The
   *   {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call thisArg}
   *   the master function is called with.
   */
  enterSlide (payload, thisArg) {
    this.callFunction_('enterSlide', payload, thisArg)
  }

  /**
   * Called before leaving a slide. This hook is triggered before the new
   * slide number `slideNoCurrent` is set in the vuex store.
   *
   * @param {object} payload
   * @property {object} payload
   * @property {module:@bldr/vue-app-presentation/content-file~Slide} payload.oldSlide
   * @property {module:@bldr/vue-app-presentation~props} payload.oldProps
   * @property {module:@bldr/vue-app-presentation/content-file~Slide} payload.newSlide
   * @property {module:@bldr/vue-app-presentation~props} payload.newProps
   *
   * @param {object} thisArg - The
   *   {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call thisArg}
   *   the master function is called with.
   */
  beforeLeaveSlide (payload, thisArg) {
    this.callFunction_('beforeLeaveSlide', payload, thisArg)
  }

  /**
   * Called when leaving a slide. This hook is triggered by the Vue lifecycle
   * hook `beforeDestroy`.
   *
   * @param {object} payload
   * @property {object} payload
   * @property {module:@bldr/vue-app-presentation/content-file~Slide} payload.oldSlide
   * @property {module:@bldr/vue-app-presentation~props} payload.oldProps
   * @property {module:@bldr/vue-app-presentation/content-file~Slide} payload.newSlide
   * @property {module:@bldr/vue-app-presentation~props} payload.newProps
   *
   * @param {object} thisArg - The
   *   {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call thisArg}
   *   the master function is called with.
   */
  leaveSlide (payload, thisArg) {
    this.callFunction_('leaveSlide', payload, thisArg)
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
    return this.callFunction_('enterStep', payload, thisArg)
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
    return this.callFunction_('leaveStep', payload, thisArg)
  }

  /**
   * Convert in the props certain strings containing markup to HTML.
   *
   * @param {module:@bldr/vue-app-presentation~props} props
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
   * @param {module:@bldr/vue-app-presentation~props} props
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
   * @param {module:@bldr/vue-app-presentation~props} props
   */
  validateUris (props) {
    if (!this.propsDef) return props
    for (const propName in props) {
      const prop = this.propsDef[propName]
      if ('mediaFileUri' in prop && prop.mediaFileUri) {
        props[propName] = validateUri(props[propName])
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
    const propsMain = this.callFunction_('collectPropsMain', props, thisArg)
    if (propsMain) return propsMain
    if (props) return props
  }

  /**
   * Collect the props (properties) for the preview Vue component.
   *
   * @param {object} payload
   * @property {object} payload
   * @property {number} payload.props - The props of the master slide.
   * @property {number} payload.propsMain - The props of the main Vue component.
   *
   * @param {object} thisArg - The
   *   {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call thisArg}
   *   the master function is called with.
   *
   * @returns {Object} - The props for the preview component as a object.
   */
  collectPropsPreview (payload, thisArg) {
    const propsPreview = this.callFunction_('collectPropsPreview', payload, thisArg)
    if (propsPreview) return propsPreview
    if (payload.propsMain) return payload.propsMain
    if (payload.props) return payload.props
  }
}

/**
 * Container for all registered master slides.
 */
class Masters {
  constructor () {
    this.store_ = {}
  }

  /**
   * Add a master to the masters container.
   *
   * @param {module:@bldr/vue-app-presentation/masters~Master} master
   */
  add (master) {
    this.store_[master.name] = master
  }

  /**
   * Get a master object by the master name.
   *
   * @param {string} name - The name of the master slide.
   *
   * @returns {module:@bldr/vue-app-presentation/masters~Master}
   */
  get (name) {
    if (!(name in this.store_)) {
      throw new Error(`Class Masters.get(): No master named “${name}”`)
    }
    return this.store_[name]
  }

  /**
   * Get all master objects as an object with the master name as properties.
   *
   * @returns {object}
   */
  get all () {
    return this.store_
  }

  /**
   * Get all master names as an array.
   *
   * @returns {Array}
   */
  get allNames () {
    return Object.keys(this.store_)
  }

  /**
   * Check if a master exist.
   *
   * @param {string} name - The name of the master slide.
   *
   * @returns {Boolean}
   */
  exists (name) {
    if (name in this.store_) return true
    return false
  }
}

/**
 * This object is mixed in into each master component.
 */
const masterMixin = {
  mounted () {
    const oldSlide = vue.$store.getters['presentation/slideOld']
    let oldProps
    if (oldSlide) {
      oldProps = oldSlide.renderData.props
    }
    // On instant slides like camera or editor there is no newSlide
    const newSlide = vue.$store.getters['presentation/slideCurrent']
    let newProps
    if (newSlide) {
      newProps = newSlide.renderData.props
      newSlide.master.enterSlide({ oldSlide, oldProps, newSlide, newProps }, this)
    }
    customStore.vueMasterInstanceCurrent = this
  },
  beforeDestroy () {
    const oldSlide = vue.$store.getters['presentation/slideOld']
    let oldProps
    if (oldSlide) {
      oldProps = oldSlide.renderData.props
    }
    // On instant slides like camera or editor there is no newSlide
    const newSlide = vue.$store.getters['presentation/slideCurrent']
    if (newSlide) {
      const newProps = newSlide.renderData.props
      newSlide.master.leaveSlide({ oldSlide, oldProps, newSlide, newProps }, this)
    }
    customStore.vueMasterInstanceCurrent = null
  }
}

/**
 * Register all masters. Search for `main.js`, `main.vue` and `preview.vue`
 * files in the subfolder `masters`.
 *
 * @see {@link https://github.com/chrisvfritz/vue-enterprise-boilerplate/blob/master/src/components/_globals.js}
 * @see {@link https://webpack.js.org/guides/dependency-management/#require-context}
 *
 * @returns {module:@bldr/vue-app-presentation/masters~Masters}
 */
function registerMasters () {
  function findMasterName (fileName) {
    const match = fileName.match(/\.\/([\w]+)\/.*/)
    if (!match) {
      throw new Error(`The master name couldn’t be retrieved from ${fileName}”`)
    }
    return match[1]
  }

  function checkExport (fileName, requiredObject) {
    if (!requiredObject) {
      throw new Error(`“${fileName}” couldn’t be imported.`)
    }
    if (!requiredObject.default) {
      throw new Error(`“${fileName}” must export a default object.`)
    }
  }

  const masters = new Masters()
  const requireMaster = require.context('./masters', true, /.+main\.js$/)
  requireMaster.keys().forEach((fileName) => {
    // ./masterName/main.js
    const masterName = findMasterName(fileName)
    const masterObject = requireMaster(fileName)
    checkExport(fileName, masterObject)
    const master = new Master(masterName)
    master.importMaster(masterObject.default)
    masters.add(master)
  })

  const requireComponentMain = require.context('./masters', true, /.+main\.vue$/)
  requireComponentMain.keys().forEach((fileName) => {
    // ./masterName/main.vue
    const masterName = findMasterName(fileName)
    const master = masters.get(masterName)
    const componentMain = requireComponentMain(fileName)
    const dataMixin = {
      data () {
        return { masterName }
      }
    }
    componentMain.default.mixins = [masterMixin, dataMixin]
    checkExport(fileName, componentMain)
    master.componentMain = componentMain.default
  })

  const requireComponentPreview = require.context('./masters', true, /.+preview\.vue$/)
  requireComponentPreview.keys().forEach((fileName) => {
    // ./masterName/preview.vue
    const masterName = findMasterName(fileName)
    const master = masters.get(masterName)
    const componentPreview = requireComponentPreview(fileName)
    checkExport(fileName, componentPreview)
    master.componentPreview = componentPreview.default
  })
  return masters
}

/**
 * An instance of the class `Masters()`
 *
 * @type {module:@bldr/vue-app-presentation/masters~Master}
 */
export const masters = registerMasters()

/**
 * This object is mixed in into each preview master vue component.
 */
const componentPreviewMixin = {
  components: {
    SlidePreviewPlayButton
  }
}

/**
 * Register all masters as Vue components.
 */
export function registerMasterComponents () {
  for (const masterName in masters.all) {
    const master = masters.get(masterName)
    if (master.componentMain) {
      Vue.component(`${masterName}-master-main`, master.componentMain)
    }
    if (master.componentPreview) {
      master.componentPreview.mixins = [componentPreviewMixin]
      Vue.component(`${masterName}-master-preview`, master.componentPreview)
    }
  }
}
