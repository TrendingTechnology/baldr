/**
 * Low level classes and functions used by the node packages. Some helper
 * functions etc.
 *
 * @module @bldr/core-node
 */

// Node packages.
const childProcess = require('child_process')
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
 * Object to cache the configuration. To avoid reading the configuration
 * file multiple times.
 */
let configJson

/**
 * By default this module reads the configuration file `/etc/baldr.json` to
 * generate its configuration object.
 *
 * @param {object} configDefault - Default options which gets merged.
 *
 * @return {object}
 */
function bootstrapConfig (configDefault) {
  if (!configJson) {
    const configFile = path.join(path.sep, 'etc', 'baldr.json')

    if (fs.existsSync(configFile)) {
      configJson = require(configFile)
    }
    if (!configJson) throw new Error(`No configuration file found: ${configFile}`)
  }

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
 * Check if some executables are installed. Throws an error if not.
 *
 * @param {Array|String} executables - An array of executables names or a
 *   a single executable as a string.
 */
function checkExecutables (executables) {
  if (!Array.isArray(executables)) executables = [executables]
  for (const executable of executables) {
    const process = childProcess.spawnSync('which', [executable], { shell: true })
    if (process.status !== 0) {
      throw new Error(`Executable is not available: ${executable}`)
    }
  }
}

/**
 * Get the page count of an PDF file. You have to install the command
 * line utility `pdfinfo` from the Poppler PDF suite.
 *
 * @see {@link https://poppler.freedesktop.org}
 *
 * @param {String} filePath - The path on an PDF file.
 *
 * @returns {Number}
 */
function getPdfPageCount (filePath) {
  checkExecutables('pdfinfo')
  if (!fs.existsSync(filePath)) throw new Error(`PDF file doesn’t exist: ${filePath}.`)
  const proc = childProcess.spawnSync(
    'pdfinfo', [filePath],
    { encoding: 'utf-8', cwd: process.cwd() }
  )
  return parseInt(proc.stdout.match(/Pages:\s+(\d+)/)[1])
}

module.exports = {
  bootstrapConfig,
  checkExecutables,
  getPdfPageCount,
  gitHead,
  log
}
