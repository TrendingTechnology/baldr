#! /usr/bin/env node

// Node packages.
const fs = require('fs')
const path = require('path')

// Third party packages.
const commander = require('commander')

// Project packages.
const { bootstrapConfig, checkExecutables } = require('@bldr/core-node')

// Globals.
const commandsPath = path.join(__dirname, 'commands')
const config = bootstrapConfig()
const cwd = process.cwd()

/**
 * To avoid duplicate aliases. The `commander` doesn’t complain about duplicates.
 *
 * @param {Array} aliases
 */
const aliases = []

const program = new commander.Command()
program.option('-v, --verbose', 'Be more verbose')
program.on('command:*', function () {
  console.error('Invalid command: %s\nSee --help for a list of available commands.', program.args.join(' '))
  process.exit(1)
})

/**
 * We use a closure to be able te require the subcommands ad hoc on invocation.
 * To avoid long loading times by many subcommands.
 *
 * @param {String} commandName - The name of the command.
 */
function actionHandler (commandName, def) {
  return function () {
    if (def.checkExecutable) {
      checkExecutables(def.checkExecutable)
    }
    const action = require(path.join(commandsPath, commandName, 'action.js'))
    // To be able to export some functions other than
    // the action function from the subcommands.
    if (typeof action === 'function') return action(...arguments)
    return action.action(...arguments)
  }
}

/**
 * Load all (sub)commands.
 *
 * @param {Object} program - An instance of the package “commander”.
 */
function loadCommands (program) {
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
  program.version(require('../package.json').version)
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

module.exports = {
  cwd, config
}

if (require.main === module) {
  main()
}
