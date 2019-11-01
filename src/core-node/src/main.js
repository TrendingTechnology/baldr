/**
 * High level classes and functions used by the node packages.
 *
 * @module @bldr/core-node
 */

// Node packages.
const fs = require('fs')
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
 * By default this module reads the configuration file `/etc/baldr.json` to
 * generate its configuration object.
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
 */
function gitHead () {
  return {
    short: git.short(),
    long: git.long(),
    isDirty: git.isDirty()
  }
}

/**
 * Convert `snake_case` or `kebab-case` strings into `camelCase` strings.
 *
 * @param {String} str - A snake or kebab cased string
 *
 * @returns {String}
 *
 * @see {@link https://catalin.me/javascript-snake-to-camel/}
 */
function snakeToCamel (str) {
  str.replace(
    /([-_][a-z])/g,
    (group) => group.toUpperCase()
      .replace('-', '')
      .replace('_', '')
  )
}

module.exports = {
  bootstrapConfig,
  gitHead,
  log,
  snakeToCamel
}