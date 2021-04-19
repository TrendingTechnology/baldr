#! /usr/bin/env node

// Node packages.
import fs from 'fs'
import path from 'path'

// Third party packages.
import { Command } from 'commander'

// Project packages.
import { checkExecutables } from '@bldr/core-node'
import { CliCommandSpec } from '@bldr/type-definitions'

import { setLogLevel } from '@bldr/log'

setLogLevel(3)

// Globals.
const commandsPath = path.join(__dirname, 'commands')

/**
 * To avoid duplicate aliases. The `commander` doesn’t complain about
 * duplicates.
 */
const aliases: string[] = []

const program = new Command()
program.option('-v, --verbose', 'Be more verbose')
program.on('command:*', function () {
  console.error('Invalid command: %s\nSee --help for a list of available commands.', program.args.join(' '))
  process.exit(1)
})

/**
 * We use a closure to be able te require the subcommands ad hoc on invocation.
 * To avoid long loading times by many subcommands.
 *
 * @param commandName - The name of the command.
 * @param def
 */
function actionHandler (commandName: string, def: CliCommandSpec) {
  return function (...args: any[]): void | Promise<void> {
    if (def.checkExecutable) {
      checkExecutables(def.checkExecutable)
    }
    const action = require(path.join(commandsPath, commandName, 'action.js'))

    args = [
      ...arguments,
      // To get the global --verbose options
      program.opts()
    ]
    // To be able to export some functions other than
    // the action function from the subcommands.
    if (typeof action === 'function') return action(...args)
    return action.action(...args)
  }
}

type Program = typeof program

/**
 * Load all (sub)commands.
 *
 * @param {Object} program - An instance of the package “commander”.
 */
function loadCommands (program: Program) {
  const subcommandDirs = fs.readdirSync(commandsPath)
  for (const commandName of subcommandDirs) {
    const def = require(path.join(commandsPath, commandName, 'def.js'))
    const subProgramm = program.command(def.command)
    if (def.alias) {
      if (!aliases.includes(def.alias)) {
        subProgramm.alias(def.alias)
        aliases.push(def.alias)
      } else {
        throw new Error(`Duplicate alias “${def.alias}” used for the (sub)command “${def.command}”.`)
      }
    }
    subProgramm.description(def.description)
    if (def.options) {
      for (const option of def.options) {
        subProgramm.option(option[0], option[1])
      }
    }
    subProgramm.action(actionHandler(commandName, def))
  }
}

function actionHelp () {
  console.log('Specify a subcommand.')
  program.outputHelp()
  process.exit(1)
}

async function main () {
  loadCommands(program)

  try {
    await program.parseAsync(process.argv)
  } catch (error) {
    console.log(error)
  }

  // [
  //  '/usr/local/bin/node',
  //  '/home/jf/.npm-packages/bin/baldr-media-server-cli'
  // ]
  if (process.argv.length <= 2) {
    actionHelp()
  }
}

if (require.main === module) {
  main()
}
