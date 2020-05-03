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
  const proc = childProcess.spawnSync(
    'pdfinfo', [filePath],
    { encoding: 'utf-8', cwd: process.cwd() }
  )
  return parseInt(proc.stdout.match(/Pages:\s+(\d+)/)[1])
}

/**
 * Execute a command on the command line. This function is a wrapper around
 * [`childProcess.spawnSync()`](https://nodejs.org/api/child_process.html#child_process_child_process_spawnsync_command_args_options).
 *
 * @param {String} args - One or more arguments.
 * @param {Object} options - See `childProcess.spawnSync()`
 *   [options](https://nodejs.org/api/child_process.html#child_process_child_process_spawnsync_command_args_options).
 *
 * @returns {Object}
 *   [see on nodejs.org](https://nodejs.org/api/child_process.html#child_process_child_process_spawnsync_command_args_options).
 */
function execute () {
  let args = Array.from(arguments)
  let options = {}
  if (args.length > 1 && typeof args[args.length - 1] === 'object') {
    options = args.pop()
  }
  options.encoding = 'utf-8'
  let result
  if (args.length === 1) {
    result = childProcess.spawnSync(args[0], options)
  } else {
    result = childProcess.spawnSync(args[0], args.slice(1), options)
  }
  if (result.status !== 0) {
    throw new Error(`Command exits with a non zero exit code: ${args.join(' ')}, Options: ${options}`)
  }
  return result
}

/**
 * Execute a command on the command line. This function is a wrapper around
 * [`childProcess.spawnSync()`](https://nodejs.org/api/child_process.html#child_process_child_process_spawnsync_command_args_options).
 *
 * @param {String} args - One or more arguments.
 * @param {Object} options - See `childProcess.spawnSync()`
 *   [options](https://nodejs.org/api/child_process.html#child_process_child_process_spawnsync_command_args_options).
 *
 * @returns {Object}
 *   [see on nodejs.org](https://nodejs.org/api/child_process.html#child_process_child_process_spawnsync_command_args_options).
 */
function executeAsync () {
  let commandString
  let args = Array.from(arguments)
  let options = {}
  if (args.length > 1 && typeof args[args.length - 1] === 'object') {
    options = args.pop()
  }
  // To get error messages on unkown commands
  options.shell = true
  return new Promise((resolve, reject) => {
    let command
    if (args.length === 1) {
      command = childProcess.spawn(args[0], options)
      commandString = args[0]
    } else {
      command = childProcess.spawn(args[0], args.slice(1), options)
      commandString = `${args[0]} ${args.slice(1).join(' ')}`
    }

    let stderr = `stderr from “${commandString}”:\n`

    command.stdout.on('data', (data) => {
      // console.log(`stdout: ${data}`)
    })

    // somehow songbook build stays open without this event.
    command.stderr.on('data', (data) => {
      stderr = stderr + data
    })

    command.on('error', (code) => {
      reject(new Error(stderr))
    })

    command.on('exit', (code) => {
      if (code === 0) {
        resolve()
      } else {
        reject(new Error(stderr))
      }
    })
  })
}

module.exports = {
  bootstrapConfig,
  checkExecutables,
  executeAsync,
  execute,
  getPdfPageCount,
  gitHead,
  log
}
