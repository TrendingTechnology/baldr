/**
 * @file Gather informations about all masters.
 */

import Vue from 'vue'
import store from '@/store.js'

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
    this.title

    /**
     * The name of an icon of the
     * {@link module:@bldr/vue-plugin-material-icon baldr icon font}.
     *
     * @type {String}
     */
    this.icon

    /**
     * A color name (CSS color class name) to colorize the master icon.
     * @see {@link module:@bldr/themes}
     *
     * @type {String}
     */
    this.color

    /**
     * A style configuration object.
     *
     * @type {module:@bldr/vue-app-presentation~styleConfig}
     */
    this.styleConfig

    /**
     * Some markdown formated string to document this master slide.
     *
     * @type {String}
     */
    this.documentation

    /**
     * A example presentation file in the YAML format like `*.baldr.yml` files
     * featuring the master.
     *
     * @type {String}
     */
    this.example

    /**
     * A vuex object containing `state`, `getters`, `actions`, `mutations`
     * properties which buildes a submodule vuex store for each master.
     *
     * @type {Object}
     */
    this.store
  }

  /**
   * The object from the exported `master` property object of the `master.vue`
   * files.
   *
   * @param {object} members
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
      if (typeof members[member] !== 'function') {
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
   * @property {module:@bldr/vue-app-presentation~Slide} payload.oldSlide
   * @property {module:@bldr/vue-app-presentation~props} payload.oldProps
   * @property {module:@bldr/vue-app-presentation~Slide} payload.newSlide
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
   * Called when leaving a slide.
   *
   * @param {object} payload
   * @property {object} payload
   * @property {module:@bldr/vue-app-presentation~Slide} payload.oldSlide
   * @property {module:@bldr/vue-app-presentation~props} payload.oldProps
   * @property {module:@bldr/vue-app-presentation~Slide} payload.newSlide
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
}

class Masters {
  constructor () {
    this.store_ = {}
  }

  add (master) {
    this.store_[master.name] = master
    this[master.name] = master
  }

  get (name) {
    return this.store_[name]
  }

  get all() {
    return this.store_
  }

  get allNames () {
    return Object.keys(this.store_)
  }
}

// https://github.com/chrisvfritz/vue-enterprise-boilerplate/blob/master/src/components/_globals.js
// https://webpack.js.org/guides/dependency-management/#require-context
const requireComponent = require.context(
  // Look for files in the current directory
  './masters',
  // Do not look in subdirectories
  false,
  // Only include .vue files
  /[\w-]+\.vue$/
)

export const masters = {}
export const mastersNg = new Masters()

// For each matching file name...
requireComponent.keys().forEach((fileName) => {
  // Get the component config
  const masterName = fileName.replace('./', '').replace('.vue', '')
  const componentConfig = requireComponent(fileName)
  const masterConfig = componentConfig.master
  const master = new Master(masterName)
  master.importMembers(masterConfig)
  master.vue = componentConfig.default
  mastersNg.add(master)
  masters[masterName] = master
  master.registerVuexModule()
})

export function registerMasterComponents () {
  for (const masterName in mastersNg.all) {
    Vue.component(`${masterName}-master`, mastersNg[masterName].vue)
  }
}
