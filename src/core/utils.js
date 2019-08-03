/**
 * @file Some low level utils
 * @module @bldr/core/utils
 */

const util = require('util')

/**
 * Wrapper around `util.format()` and `console.log()`
 */
function log (format) {
  const args = Array.from(arguments).slice(1)
  console.log(util.format(format, ...args))
}

exports.log = log
