#! /usr/bin/env node

import fs from 'fs'
import path from 'path'

// Project packages.
import { checkExecutables } from '@bldr/core-node'
import { CliTypes } from '@bldr/type-definitions'

import * as log from '@bldr/log'
import * as mediaManager from '@bldr/media-manager'

import { Command } from 'commander'

// Globals.
const commandsPath = path.join(new URL('.', import.meta.url).pathname, 'commands')

/**
 * To avoid duplicate aliases. The `commander` doesn’t complain about
 * duplicates.
 */
const aliases: string[] = []

function increaseVerbosity (dummyValue: any, previous: number): number {
  const newVerbositiy = previous + 1
  log.setLogLevel(newVerbositiy)
  mediaManager.setLogLevel(newVerbositiy)
  return newVerbositiy
}

const program = new Command()
program.option('-v, --verbose', 'Be more verbose', increaseVerbosity, 2)

program.option(
  '--parent-pres-dir',
  'Run the normalize command on all files in the parent presentation folder.'
)

program.on('command:*', function () {
  console.error(
    'Invalid command: %s\nSee --help for a list of available commands.',
    program.args.join(' ')
  )
  process.exit(1)
})

type ActionHandlerFunction = (...args: any[]) => void | Promise<void>

function convertPathArgToParentPresDir (args: any[]): any[] {
  const allOpts = collectAllOpts(program)
  if (
    allOpts.parentPresDir != null &&
    allOpts.parentPresDir === true &&
    Array.isArray(args[0]) &&
    typeof args[0][0] === 'string'
  ) {
    const presParentDir = mediaManager.locationIndicator.getPresParentDir(
      args[0][0]
    )
    if (presParentDir != null) {
      log.info(
        '--parent-pres-dir: Run the task on the parent presentation folder: %s',
        [presParentDir]
      )
      args[0][0] = presParentDir
    }
  }
  return args
}

/**
 * We use a closure to be able te require the subcommands ad hoc on invocation.
 * To avoid long loading times by many subcommands.
 *
 * @param commandName - The name of the command.
 */
function actionHandler (
  commandName: string,
  def: CliTypes.CliCommandSpec
): ActionHandlerFunction {
  return async function (...args: any[]): Promise<void> {
    if (def.checkExecutable != null) {
      checkExecutables(def.checkExecutable)
    }
    // eslint-disable-next-line
    const a = await import(path.join(commandsPath, commandName, 'action.js'))
    const action = a.default

    args = [...arguments, program.opts()]
    args = convertPathArgToParentPresDir(args)

    // To be able to export some functions other than
    // the action function from the subcommands.
    if (typeof action === 'function') {
      return action(...args)
    }
    return action.action(...args)
  }
}

type Program = typeof program

/**
 * Load all (sub)commands.
 *
 * @param program - An instance of the package “commander”.
 */
async function loadCommands (program: Program): Promise<void> {
  const subcommandDirs = fs.readdirSync(commandsPath)
  for (const commandName of subcommandDirs) {
    // eslint-disable-next-line
    const def = await import(path.join(
      commandsPath,
      commandName,
      'def.js'
    ))

    const definition = def.default as CliTypes.CliCommandSpec
    const subProgramm = program.command(definition.command)
    if (definition.alias != null) {
      if (!aliases.includes(definition.alias)) {
        subProgramm.alias(definition.alias)
        aliases.push(definition.alias)
      } else {
        throw new Error(
          `Duplicate alias “${definition.alias}” used for the (sub)command “${definition.command}”.`
        )
      }
    }
    subProgramm.description(definition.description)
    if (definition.options != null) {
      for (const option of definition.options) {
        subProgramm.option(option[0], option[1])
      }
    }
    subProgramm.action(actionHandler(commandName, definition))
  }
}

function actionHelp (): void {
  log.error('Specify a subcommand.')
  program.outputHelp()
  process.exit(1)
}

/**
 * Collect all options. This is a temporary hack function.
 *
 * https://github.com/tj/commander.js/pull/1478
 * https://github.com/tj/commander.js/pull/1475
 *
 * ```js
 * import { collectAllOpts } from '../../main'
 *
 * function action (cmdObj: CmdObj, program: any): void {
 *   collectAllOpts(program)
 * }
 * ```
 *
 * @returns An object with all options
 */
export function collectAllOpts (program: any): any {
  const result = {}
  Object.assign(result, program.opts())
  for (
    let parentCmd = program.parent;
    parentCmd != null;
    parentCmd = parentCmd.parent
  ) {
    Object.assign(result, parentCmd.opts())
  }
  return result
}

export function validateDefintion (
  spec: CliTypes.CliCommandSpec
): CliTypes.CliCommandSpec {
  return spec
}

async function main (): Promise<void> {
  await loadCommands(program)

  try {
    await program.parseAsync(process.argv)
  } catch (error) {
    log.error(String(error))
    log.errorAny(error)
  }

  // [
  //  '/usr/local/bin/node',
  //  '/home/jf/.npm-packages/bin/baldr-media-server-cli'
  // ]
  if (process.argv.length <= 2) {
    actionHelp()
  }
}

// if (require.main === module) {
main()
// .then()
// .catch(reason => log.info(String(reason)))
// }
