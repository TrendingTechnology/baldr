/**
 * @file Gather informations about all masters.
 */

import Vue from 'vue'

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
  const componentConfig = requireComponent(fileName)
  const masterConfig = componentConfig.master
  masters[masterConfig.name] = masterConfig
  componentDefaults[masterConfig.name] = componentConfig.default
})

export function registerMasterComponents () {
  for (const masterName in masters) {
    Vue.component(`${masterName}-master`, componentDefaults[masterName])
  }
}

export const masterNames = Object.keys(masters)

export function toClassName (masterName) {
  const titleCase = masterName.charAt(0).toUpperCase() + masterName.substr(1).toLowerCase()
  return `${titleCase}Master`
}

export function masterOptions (masterName) {
  return masters[masterName]
}

export function callMasterFunc (masterName, funcName, payload) {
  const options = masterOptions(masterName)
  if (funcName in options && typeof options[funcName] === 'function') {
    return options[funcName](payload)
  }
}
