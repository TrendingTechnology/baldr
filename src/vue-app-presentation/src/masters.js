/**
 * Gather informations about all masters.
 *
 * @module @bldr/vue-app-presentation/masters
 */

import vue, { customStore } from '@/main.js'
import Vue from 'vue'
import store from '@/store.js'
import { markupToHtml, validateUri } from '@/lib.js'

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
    this.color = color ? color : 'orange'

    /**
     * Show the icon the on slide view.
     *
     * @type {Boolean}
     */
    this.showOnSlides = showOnSlides === false ? false : true

    /**
     * `small` or `large`
     *
     * @type {String}
     */
    this.size = size ? size : 'small'
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
     * A example presentation file in the YAML format like `*.baldr.yml` files
     * featuring the master.
     *
     * @type {String}
     */
    this.example = null

    /**
     * A vuex object containing `state`, `getters`, `actions`, `mutations`
     * properties which buildes a submodule vuex store for each master.
     *
     * @type {Object}
     */
    this.store = null

    /**
     * The Vue instance of the corresponding vue component.
     *
     * @type {Object}
     */
    this.vue = null
  }

  /**
   * Import non function properties of the master object of the master.vue
   * components.
   *
   * @param {object} members - The object from the exported `master` property
   * object of the `master.vue` files.
   */
  importMembers (members) {
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
  }

  /**
   * Must called after `this.store` is set.
   */
  registerVuexModule () {
    if (this.store) {
      this.store.namespaced = true
      store.registerModule(this.name, this.store)
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
   * @param {module:@bldr/vue-app-presentation~props} props
   *
   * @returns {Number}
   */
  stepCount (props) {
    return this.callFunction_('stepCount', props)
  }

  /**
   * An array of media URIs to resolve (like [id:beethoven, filename:mozart.mp3])
   * @param {module:@bldr/vue-app-presentation~props} props
   *
   * @returns {Array}
   */
  resolveMediaUris (props) {
    return this.callFunction_('resolveMediaUris', props)
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
    if (!('props' in this.vue)) return props
    for (const propName in props) {
      const vueProp = this.vue.props[propName]
      if ('markup' in vueProp && vueProp.markup) {
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
      if ('props' in this.vue && !(propName in this.vue.props)) {
        throw new Error(`The master slide “${this.name}” has no property (prop) named “${propName}”.`)
      }
    }
  }

  /**
   * Validate all media file URIs in the props of a certain slide.
   *
   * @param {module:@bldr/vue-app-presentation~props} props
   */
  validateUris (props) {
    if (!('props' in this.vue)) return props
    for (const propName in props) {
      const vueProp = this.vue.props[propName]
      if ('mediaFileUri' in vueProp && vueProp.mediaFileUri) {
        props[propName] = validateUri(props[propName])
      }
    }
    return props
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
   *
   * @param {module:@bldr/vue-app-presentation/masters~Master} master
   */
  add (master) {
    this.store_[master.name] = master
    this[master.name] = master
  }

  /**
   * Get a master object by the master name.
   *
   * @param {string} name
   *
   * @returns {module:@bldr/vue-app-presentation/masters~Master}
   */
  get (name) {
    return this.store_[name]
  }

  /**
   * Get all master objects as and object with the master name as properties.
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
    const newSlide = vue.$store.getters['presentation/slideCurrent']
    const newProps = newSlide.renderData.props
    newSlide.master.enterSlide({ oldSlide, oldProps, newSlide, newProps }, this)
    customStore.vueMasterInstanceCurrent = this
  },
  beforeDestroy () {
    const oldSlide = vue.$store.getters['presentation/slideOld']
    let oldProps
    if (oldSlide) {
      oldProps = oldSlide.renderData.props
    }
    const newSlide = vue.$store.getters['presentation/slideCurrent']
    const newProps = newSlide.renderData.props
    newSlide.master.leaveSlide({ oldSlide, oldProps, newSlide, newProps }, this)
    customStore.vueMasterInstanceCurrent = null
  }
}

/**
 * Register all masters. Search for `master.vue` files in the subfolder
 * `masters`.
 *
 * @see {@link https://github.com/chrisvfritz/vue-enterprise-boilerplate/blob/master/src/components/_globals.js}
 * @see {@link https://webpack.js.org/guides/dependency-management/#require-context}
 *
 * @returns {module:@bldr/vue-app-presentation/masters~Masters}
 */
function registerMasters () {
  //
  const requireComponent = require.context(
    // Look for files in the current directory
    './masters',
    // Do not look in subdirectories
    false,
    // Only include .vue files
    /[\w-]+\.vue$/
  )

  const masters = new Masters()

  // For each matching file name...
  requireComponent.keys().forEach((fileName) => {
    // Get the component config
    const masterName = fileName.replace('./', '').replace('.vue', '')
    const componentConfig = requireComponent(fileName)
    const dataMixin = {
      data () {
        return { masterName }
      }
    }
    componentConfig.default.mixins = [masterMixin, dataMixin]
    const masterConfig = componentConfig.master
    const master = new Master(masterName)
    master.importMembers(masterConfig)
    master.vue = componentConfig.default
    master.registerVuexModule()

    masters.add(master)
  })

  return masters
}

function registerMastersNg () {
  function findMasterName (fileName) {
    return fileName.match(/\.\/([\w]+)\/.*/)[1]
  }

  const masters = new Masters()
  const requireMaster = require.context('./masters-ng', true, /.+main\.js$/)
  requireMaster.keys().forEach((fileName) => {
    // ./masterName/main.js
    const masterName = findMasterName(fileName)
    const masterObject = requireMaster(fileName)
    const master = new Master(masterName)
    master.importMembers(masterObject.default)
    masters.add(master)
  })

  const requireComponentMain = require.context('./masters-ng', true, /.+main\.vue$/)
  requireComponentMain.keys().forEach((fileName) => {
    // ./masterName/main.vue
    const masterName = findMasterName(fileName)
    const master = masters.get(masterName)
    master.componentMain = requireComponentMain(fileName).default
  })

  const requireComponentPreview = require.context('./masters-ng', true, /.+preview\.vue$/)
  requireComponentPreview.keys().forEach((fileName) => {
    // ./masterName/preview.vue
    const masterName = findMasterName(fileName)
    const master = masters.get(masterName)
    master.componentPreview = requireComponentPreview(fileName).default
  })
  return masters
}

export const mastersNg = registerMastersNg()

/**
 * An instance of the class `Masters()`
 *
 * @type {module:@bldr/vue-app-presentation/masters~Master}
 */
export const masters = registerMasters()

/**
 * Register all masters as Vue components.
 */
export function registerMasterComponents () {
  for (const masterName in masters.all) {
    Vue.component(`${masterName}-master`, masters[masterName].vue)
  }

  for (const masterName in mastersNg.all) {
    const master =  masters[masterName]
    if (master.componentMain) {
      Vue.component(`${masterName}-master-main`, masters[masterName].componentMain)
    }
    if (master.componentPreview) {
      Vue.component(`${masterName}-master-preview`, masters[masterName].componentPreview)
    }
  }
}
