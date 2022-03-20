/**
 * Some utilities for the subcommands of the package @bldr/cli.
 *
 * @module @bldr/cli-utils
 */

import * as childProcess from 'child_process'
import os from 'os'

import ora from 'ora'
// TODO remove dependency object-assign
// Error: Cannot find module 'object-assign'
import 'object-assign'
import Gauge from 'gauge'
import * as log from '@bldr/log'

interface CommandRunnerOption {
  verbose: boolean
}

interface CommandRunnerExecOption {
  cwd?: string
  detached?: boolean
  shell?: boolean
  encoding?: string
}

class CommandResult {
  stdout?: string
  stderr?: string

  constructor ({ stdout, stderr }: any) {
    this.stdout = stdout
    this.stderr = stderr
  }
}

class ArgsParser {
  command: string
  args: string[] = []
  constructor (args: any[]) {
    this.command = args[0]
    if (args.length > 1) {
      this.args = args.slice(1)
    }
  }

  toString (): string {
    if (this.args.length > 0) {
      return `${this.command} ${this.args.join(' ')}`
    } else {
      return this.command
    }
  }
}

export async function execute (
  args: string[],
  options?: CommandRunnerExecOption
): Promise<CommandResult> {
  const argsParser = new ArgsParser(args)

  // To get error messages on unkown commands
  if (options == null) {
    options = {}
  }

  if (options.encoding === undefined) {
    options.encoding = 'utf-8'
  }

  return await new Promise((resolve, reject) => {
    const command = childProcess.spawn(
      argsParser.command,
      argsParser.args,
      options
    )

    if (options?.detached != null && options.detached) {
      command.unref()
      resolve(new CommandResult({}))
    }

    let stdout: string = ''
    let stderr: string = ''

    command.stdout.setEncoding('utf-8')
    command.stdout.on('data', (data: string) => {
      log.debug('stdout: %s', [data])
      stdout = stdout + data
    })

    command.stderr.setEncoding('utf-8')
    command.stderr.on('data', (data: string) => {
      log.debug('stderr: %s', [data])
      stderr = stderr + data
    })

    command.on('error', code => {
      reject(new Error(stderr))
    })

    command.on('exit', code => {
      if (code === 0) {
        resolve(new CommandResult({ stdout, stderr }))
      } else {
        reject(new Error(stderr))
      }
    })
  })
}

/**
 * Run commands on the command line in a nice and secure fashion.
 */
export class CommandRunner {
  /**
   * Print out captured stdout and stderr of the method exec form
   * childProcess.
   */
  private readonly verbose: boolean

  /**
   * An instance of the Ora package terminal spinner.
   *
   * @see {@link https://www.npmjs.com/package/ora}
   */
  private spinner: ora.Ora

  /**
   * An instance of the Gauge progress bar.
   */
  private readonly gauge: any

  /**
   * The current log message. If you use `this.log(message)`, message is
   * stored in this attribute. `this.exec(args[])` appends in the verbose mode
   * stdout and stderr to this message.
   */
  private message: string

  constructor (options?: CommandRunnerOption) {
    this.verbose = options?.verbose != null && options?.verbose
    this.spinner = ora({ spinner: 'line' })
    this.gauge = new Gauge()
    this.gauge.setTheme('ASCII')

    this.message = ''
  }

  checkRoot (): void {
    const user = os.userInfo()
    if (user.username !== 'root') {
      console.error('You need to be root: sudo /usr/local/bin/baldr …')
      process.exit()
    }
  }

  /**
   * Start the Ora terminal spinner.
   */
  startSpin (): void {
    this.spinner.start()
  }

  /**
   * Start the Gauge progress bar.
   */
  startProgress (): void {
    this.gauge.show('default', 0)
  }

  /**
   * Update the Gauge progress bar.
   *
   * @param completed -  The percent completed as a value between 0 and 1.
   * @param text - The text displayed to the right of the image.
   */
  updateProgress (completed: number, text: string): void {
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
   * @param args - One or more arguments.
   * @param options - See `childProcess.spawn()`
   *   [options](https://nodejs.org/api/child_process.html#child_process_child_process_spawnsync_command_args_options).
   *
   * @returns
   *   [see on nodejs.org](https://nodejs.org/api/child_process.html#child_process_child_process_spawnsync_command_args_options).
   */
  async exec (
    args: string[],
    options?: CommandRunnerExecOption
  ): Promise<CommandResult> {
    const argsParser = new ArgsParser(args)

    if (this.verbose) {
      this.startSpin()
    }

    // To get error messages on unkown commands
    if (options == null) {
      options = {}
    }

    if (options.shell === undefined) {
      options.shell = true
    }

    if (options.encoding === undefined) {
      options.encoding = 'utf-8'
    }

    return await new Promise((resolve, reject) => {
      const command = childProcess.spawn(
        argsParser.command,
        argsParser.args,
        options
      )

      if (this.verbose) {
        this.message = log.format('Exec: %s', [argsParser.toString()])
      }

      if (options?.detached != null && options.detached) {
        command.unref()
        resolve(new CommandResult({}))
      }

      let stdout: string = ''
      let stderr: string = ''

      command.stdout.on('data', (data: Buffer) => {
        this.logStdOutErr(data)
        stdout = stdout + data.toString()
      })

      // somehow songbook build stays open without this event.
      command.stderr.on('data', (data: Buffer) => {
        this.logStdOutErr(data)
        stderr = stderr + data.toString()
      })

      command.on('error', code => {
        reject(new Error(stderr))
      })

      command.on('exit', code => {
        if (code === 0) {
          resolve(new CommandResult({ stdout, stderr }))
        } else {
          reject(new Error(stderr))
        }
      })
    })
  }

  execSync (args: string[]): CommandResult {
    const argsParser = new ArgsParser(args)
    const command = childProcess.spawnSync(
      argsParser.command,
      argsParser.args,
      { encoding: 'utf-8', shell: true }
    )
    if (command.status !== 0) {
      if (command.stderr != null) {
        log.error(command.stderr)
      }
      throw new Error(
        log.format(
          'Command “%s” exists with a nonzero exit code.',
          [argsParser.toString()],
          'none'
        )
      )
    }
    return new CommandResult(command)
  }

  /**
   * Append the buffed data stream from the child process to the spinner text.
   *
   * @param data - The binary output from childProcess.
   */
  logStdOutErr (data: Buffer): void {
    if (this.verbose) {
      let cleanedText = data.toString().trim()
      cleanedText = cleanedText.replace(/<s> \[webpack\.Progress\]/, '')
      cleanedText = cleanedText.replace(/\s{2,}/, ' ')
      this.setSpinnerText(this.message + ' ' + cleanedText)
    }
  }

  /**
   * Set the spinner text and cut the lenght of the text to fit in a
   * terminal window.
   *
   * @param text - The text to set on the spinner.
   */
  private setSpinnerText (text: string): void {
    this.spinner.text = text.substring(0, process.stdout.columns - 3)
  }

  /**
   * @param message - A message to show after the spinner.
   */
  log (message: string): void {
    this.message = message
    this.setSpinnerText(message)
  }

  /**
   * Catch an error and exit the progress.
   */
  catch (error: Error): void {
    this.stopSpin()
    console.log(error)
    process.exit()
  }

  /**
   * Stop the gauge progress bar.
   */
  stopProgress (): void {
    this.gauge.hide()
  }

  /**
   * Stop the command line spinner.
   */
  stopSpin (): void {
    this.spinner.stop()
  }
}
