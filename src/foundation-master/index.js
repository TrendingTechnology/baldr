/**
 * @module @bldr/foundation-master
 */

'use strict'

// Node packages.
const path = require('path')

/**
 *
 */
const requireLib = function (fileName) {
  return require(path.join(__dirname, fileName + '.js'))
}

const { getConfig } = requireLib('config')
const {
  addCSSFile,
  reIndex,
  checkProperty
} = requireLib('helper')
const { Media } = requireLib('media')

module.exports = {
  addCSSFile: addCSSFile,
  getConfig: getConfig,
  Media: Media,
  reIndex: reIndex,
  checkProperty: checkProperty
}
