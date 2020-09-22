/**
 * Some utilities for the subcommands of the package @bldr/cli.
 *
 * @module @bldr/cli-utils
 */

// Node packages.
const childProcess = require('child_process')
const os = require('os')

const ora = require('ora')
// TODO remove dependency object-assign
// Error: Cannot find module 'object-assign'
const Gauge = require('gauge')

/**
 * Run commands on the command line in a nice and secure fashion.
 */
class CommandRunner {
  constructor (options) {
    this.verbose = (options && options.verbose)
    this.spinner = ora({ spinner: 'line' })
    this.gauge = new Gauge()
    this.gauge.setTheme('ASCII')
  }

  /**
   *
   */
  checkRoot () {
    const user = os.userInfo()
    if (user.username !== 'root') {
      console.error(`You need to be root: sudo /usr/local/bin/baldr …`)
      process.exit()
    }
  }

  /**
   *
   */
  startSpin () {
    this.spinner.start()
  }

  /**
   *
   */
  startProgress () {
    this.gauge.show('default', 0)
  }

  /**
   *
   */
  updateProgress (completed, text) {
    this.gauge.pulse()
    this.gauge.show(text, completed)
  }

  /**
   * Execute a command on the command line. This function is a wrapper around
   * [`childProcess.spawn()`](https://nodejs.org/api/child_process.html#child_process_child_process_spawnsync_command_args_options).
   *
   * For example `cmd.exec('youtube-dl', youtubeId, { cwd: ytDir })`.
   * We have to run the commands asynchronous because of the spinner.
   *
   * @param {String} args - One or more arguments.
   * @param {Object} options - See `childProcess.spawnSync()`
   *   [options](https://nodejs.org/api/child_process.html#child_process_child_process_spawnsync_command_args_options).
   *
   * @returns {Object}
   *   [see on nodejs.org](https://nodejs.org/api/child_process.html#child_process_child_process_spawnsync_command_args_options).
   */
  exec () {
    const args = Array.from(arguments)
    let options = {}
    if (args.length > 1 && typeof args[args.length - 1] === 'object') {
      options = args.pop()
    }
    // To get error messages on unkown commands
    options.shell = true
    options.encoding = 'utf-8'
    return new Promise((resolve, reject) => {
      let command
      if (args.length === 1) {
        command = childProcess.spawn(args[0], options)
      } else {
        command = childProcess.spawn(args[0], args.slice(1), options)
      }

      if (options.detached) {
        command.unref()
        resolve()
      }

      let stdout = ''
      let stderr = ''

      command.stdout.on('data', (data) => {
        if (this.verbose) console.log(data.toString())
        stdout = stdout + data
      })

      // somehow songbook build stays open without this event.
      command.stderr.on('data', (data) => {
        if (this.verbose) console.log(data.toString())
        stderr = stderr + data
      })

      command.on('error', (code) => {
        reject(new Error(stderr))
      })

      command.on('exit', (code) => {
        if (code === 0) {
          resolve({ stdout, stderr })
        } else {
          reject(new Error(stderr))
        }
      })
    })
  }

  /**
   *
   */
  log (msg) {
    this.spinner.text = msg
  }

  /**
   *
   */
  catch (error) {
    this.stopSpin()
    console.log(error)
    process.exit()
  }

  /**
   *
   */
  stopProgress () {
    this.gauge.hide()
  }

  /**
   *
   */
  stopSpin () {
    this.spinner.stop()
  }
}

module.exports = {
  CommandRunner
}
