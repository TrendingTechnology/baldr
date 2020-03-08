#! /usr/bin/env node

// Node packages.
const fs = require('fs')
const path = require('path')

// Third party packages.
let commander = require('commander')

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

/**
 * Load all (sub)commands in the subfolder `commands`
 *
 * @param {Object} commander - An instance of the package “commander”.
 */
function loadCommands (commander) {
  for (const fileName of fs.readdirSync(commandsPath)) {
    const conf = require(path.join(commandsPath, fileName))
    if (conf.checkExecutable) {
      checkExecutables(conf.checkExecutable)
    }
    const c = commander.command(conf.command)
    if (conf.alias) {
      if (!aliases.includes(conf.alias)) {
        c.alias(conf.alias)
        aliases.push(conf.alias)
      }
      else {
        throw new Error(`Duplicate alias “${conf.alias}” used for the (sub)command “${conf.command}”.`)
      }
    }
    c.description(conf.description)
    if (conf.options) {
      for (const option of conf.options) {
        c.option(option[0], option[1])
      }
    }
    c.action(conf.action)
  }
}

function actionHelp () {
  console.log('Specify a subcommand.')
  commander.outputHelp()
  process.exit(1)
}

async function main () {
  commander.version(require('../package.json').version)
  loadCommands(commander)
  commander.exitOverride()

  try {
    await commander.parseAsync(process.argv)
    // custom processing...
  } catch (error) {
    console.log(error)
    process.exit()
  }

  // [
  //  '/usr/local/bin/node',
  //  '/home/jf/.npm-packages/bin/baldr-media-server-cli'
  // ]
  if (process.argv.length <= 2) {
    actionHelp()
  }
  // TODO: Somehow the commander hangs. Fix this.
  process.exit()
}

module.exports = {
  cwd, config
}

if (require.main === module) {
  main()
}
