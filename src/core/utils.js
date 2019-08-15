/**
 * @file Some low level utils
 * @module @bldr/core/utils
 */

 // Node packages.
const fs = require('fs')
const os = require('os')
const path = require('path')
const util = require('util')

// Third party packages
const git = require('git-rev-sync')

/**
 * Wrapper around `util.format()` and `console.log()`
 */
function log (format) {
  const args = Array.from(arguments).slice(1)
  console.log(util.format(format, ...args))
}

/**
 * By default this module reads the config file ~/.baldr.json to generate its
 * config object.
 *
 * @param {object} configDefault - Default options which gets merged.
 *
 * @return {object}
 */
function bootstrapConfig (configDefault) {
  const configFile = path.join(os.homedir(), '.baldr.json')
  if (fs.existsSync(configFile)) {
    const configJson = require(configFile)
    if (configDefault) {
      return Object.assign(config, configJson)
    }
    return configJson
  }
  throw new Error(`No configuration file found: ${configFile}`)
}

/**
 * Generate a revision string in the form version-gitshort(-dirty)
 *
 * @param {string} version - The version
 *   string from package.json
 */
function revisionString (version) {
  const segments = []
  if (version) {
    segments.push(version)
  }
  segments.push(git.short())
  if (git.isDirty()) segments.push('dirty')
  return segments.join('-')
}

exports.log = log
exports.bootstrapConfig = bootstrapConfig
exports.revisionString = revisionString
