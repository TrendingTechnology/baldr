/**
 * @file Gather informations about all masters.
 */

import QuoteMaster from '@/masters/QuoteMaster'
import MarkdownMaster from '@/masters/MarkdownMaster'

export const components = {
  QuoteMaster,
  MarkdownMaster
}

export const masterNames = [
  'quote',
  'markdown'
]

export function toClassName (masterName) {
  const titleCase = masterName.charAt(0).toUpperCase() + masterName.substr(1).toLowerCase()
  return `${titleCase}Master`
}

export function masterOptions (masterName) {
  return components[toClassName(masterName)]
}

export function callMasterFunc (masterName, funcName, payload) {
  const options = masterOptions(masterName)
  if (funcName in options && typeof options[funcName] === 'function') {
    return options[funcName](payload)
  }
}

export default {
  components
}
