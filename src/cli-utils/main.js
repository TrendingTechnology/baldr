/**
 * Low level classes and functions used by the node packages. Some helper
 * functions etc.
 *
 * @module @bldr/core-node
 */

// Node packages.
const childProcess = require('child_process')

const ora = require('ora')
const Gauge = require('gauge')

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
function executeSync () {
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

/**
 * Run commands on the command line in a nice a secure fashion.
 */
class CommandRunner {
  constructor () {
    this.spinner = ora({ spinner: 'line' })
    this.gauge = new Gauge()
  }

  startSpin () {
    this.spinner.start()
  }

  startProgress () {
    this.gauge.show('default', 0)
  }

  updateProgress (completed) {
    console.log(completed)
    this.gauge.pulse()
    this.gauge.show('default', completed)
  }

  exec () {
    // We have to run the commands asynchronous because of spinner.
    return executeAsync (...arguments)
  }

  log (msg) {
    this.spinner.text = msg
  }

  catch (error) {
    this.stopSpin()
    console.log(error)
    process.exit()
  }

  stopProgress () {
    this.gauge.hide()
  }

  stopSpin () {
    this.spinner.stop()
  }
}

module.exports = {
  CommandRunner,
  executeAsync,
  executeSync
}
