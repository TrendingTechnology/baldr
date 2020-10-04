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

const chalk = require('chalk')

/**
 * Run commands on the command line in a nice and secure fashion.
 */
class CommandRunner {
  /**
   *
   * @param {Object} options
   * @property {Boolean} verbose
   */
  constructor (options) {
    /**
     * Print out captured stdout and stderr of the method exec form
     * childProcess.
     *
     * @type {Boolean}
     */
    this.verbose = (options && options.verbose)

    /**
     * A instance of the Ora package terminal spinner.
     *
     * @see {@link https://www.npmjs.com/package/ora}
     *
     * @type {Object}
     */
    this.spinner = ora({ spinner: 'line' })

    /**
     *
     */
    this.gauge = new Gauge()
    this.gauge.setTheme('ASCII')

    /**
     * The current log message. If you use `this.log(message)`, message is
     * stored in this attribute. `this.exec(args[])` appends in the verbose mode
     * stdout and stderr to this message.
     *
     * @type {String}
     */
    this.message = ''
  }

  /**
   *
   */
  checkRoot () {
    const user = os.userInfo()
    if (user.username !== 'root') {
      console.error('You need to be root: sudo /usr/local/bin/baldr …')
      process.exit()
    }
  }

  /**
   * Start the Ora terminal spinner.
   */
  startSpin () {
    this.spinner.start()
  }

  /**
   * Start the Gauge progress bar.
   */
  startProgress () {
    this.gauge.show('default', 0)
  }

  /**
   * Update the Gauge progress bar.
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
    if (this.verbose) this.startSpin()

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
      let commandString
      if (args.length === 1) {
        command = childProcess.spawn(args[0], options)
        commandString = args[0]
      } else {
        command = childProcess.spawn(args[0], args.slice(1), options)
        commandString = `${args[0]} ${args.slice(1).join(' ')}`
      }

      if (this.verbose) {
        this.message = `Exec: ${chalk.yellow(commandString)}`
      }

      if (options.detached) {
        command.unref()
        resolve()
      }

      let stdout = ''
      let stderr = ''

      command.stdout.on('data', (data) => {
        this.logStdOutErr(data)
        stdout = stdout + data
      })

      // somehow songbook build stays open without this event.
      command.stderr.on('data', (data) => {
        this.logStdOutErr(data)
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
   * @param {Buffer} data - Binary output from childProcess.
   */
  logStdOutErr (data) {
    if (this.verbose) {
      const cleanedText = data.toString().trim()
      this.spinner.text = this.message + ' ' + cleanedText
    }
  }

  /**
   * @param {String} message - A message to show after the spinner.
   */
  log (message) {
    this.message = message
    this.spinner.text = message
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
