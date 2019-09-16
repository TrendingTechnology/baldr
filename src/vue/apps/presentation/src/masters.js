/**
 * @file Gather informations about all masters.
 */

import Vue from 'vue'
import store from '@/store.js'

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
  masters[masterName] = masterConfig
  masters[masterName].name = masterName
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

export function callMasterFunc (masterName, funcName, payload) {
  const options = masterOptions(masterName)
  if (funcName in options && typeof options[funcName] === 'function') {
    return options[funcName](payload)
  }
}
