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
  const configFile = path.join(path.sep, 'etc', 'baldr.json')

  let configJson
  if (fs.existsSync(configFile)) {
    configJson = require(configFile)
  }

  if (!configJson) throw new Error(`No configuration file found: ${configFile}`)

  if (configDefault) {
    return Object.assign(configDefault, configJson)
  }
  return configJson
}

/**
 * Generate a revision string in the form version-gitshort(-dirty)
 *
 */
function gitHead () {
  return {
    short: git.short(),
    long: git.long(),
    isDirty: git.isDirty()
  }
}

exports.bootstrapConfig = bootstrapConfig
exports.log = log
exports.gitHead = gitHead
