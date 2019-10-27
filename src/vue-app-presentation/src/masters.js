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
  }

  /**
   *
   * @param {*} config
   */
  importMembers (config) {
    for (const member in config) {
      this[member] = config[member]
    }
  }

  /**
   * result must fit to props
   * @param {object} props
   */
  normalizeProps (props) {}

  /**
   *
   * @param {*} props
   */
  stepCount (props) {}

  /**
   * An array of media URIs to resolve (like [id:beethoven, filename:mozart.mp3])
   * @param {*} props
   */
  resolveMediaUris (props) {}

  /**
   *
   * @param {*} props
   */
  plainTextFromProps (props) {}

  /**
   * Called when entering a slide.
   * @param {*} param0
   */
  enterSlide ({ oldSlide, oldProps, newSlide, newProps }) {}

  /**
   * Called when leaving a slide.
   * @param {*} param0
   */
  leaveSlide ({ oldSlide, oldProps, newSlide, newProps }) {}

  /**
   * Called when entering a step.
   */
  enterStep ({ oldStepNo, newStepNo }) {}

  /**
   * Called when leaving a step.
   */
  leaveStep ({ oldStepNo, newStepNo }) {}
}

// https://github.com/chrisvfritz/vue-enterprise-boilerplate/blob/master/src/components/_globals.js
// https://webpack.js.org/guides/dependency-management/#require-context
const requireComponent = require.context(
  // Look for files in the current directory
  './masters',
  // Do not look in subdirectories
  false,
  // Only include "_base-" prefixed .vue files
  /[\w-]+\.vue$/
)

const componentDefaults = {}

export const masters = {}

// For each matching file name...
requireComponent.keys().forEach((fileName) => {
  // Get the component config
  const masterName = fileName.replace('./', '').replace('.vue', '')
  const componentConfig = requireComponent(fileName)
  const masterConfig = componentConfig.master
  const master = new Master(masterName)
  master.importMembers(masterConfig)
  masters[masterName] = master
  masters[masterName].vue = componentConfig.default
  // Remove the empty line at the beginning of the backtick string example.
  if ('example' in masters[masterName]) {
    masters[masterName].example = masters[masterName].example.replace(/^\n*/, '')
  }

  if ('store' in masters[masterName]) {
    const storeModule = masters[masterName].store
    storeModule.namespaced = true
    store.registerModule(masterName, storeModule)
  }
  componentDefaults[masterName] = componentConfig.default
})

export function registerMasterComponents () {
  for (const masterName in masters) {
    Vue.component(`${masterName}-master`, componentDefaults[masterName])
  }
}

export const masterNames = Object.keys(masters)

export function masterOptions (masterName) {
  return masters[masterName]
}

export function callMasterFunc (masterName, funcName, payload, context) {
  const options = masterOptions(masterName)
  if (funcName in options && typeof options[funcName] === 'function') {
    if (context) {
      return options[funcName].call(context, payload)
    }
    return options[funcName](payload)
  }
}
