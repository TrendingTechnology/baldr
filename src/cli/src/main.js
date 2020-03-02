#! /usr/bin/env node

// Node packages.
const fs = require('fs')
const path = require('path')

// Third party packages.
let commander = require('commander')

// Project packages.
const { bootstrapConfig, checkExecutables } = require('@bldr/core-node')

// Globals.
const subcommandsPath = path.join(__dirname, 'subcommands')
const config = bootstrapConfig()

function loadCommands (commander) {
  for (const fileName of fs.readdirSync(subcommandsPath)) {
    const conf = require(path.join(subcommandsPath, fileName))
    if (conf.checkExecutable) {
      checkExecutables(conf.checkExecutable)
    }
    const c = commander.command(conf.commandName)
    if (conf.alias) {
      c.alias(conf.alias)
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

function main () {
  commander.version(require('../package.json').version)
  loadCommands(commander)
  commander.parse(process.argv)
  // [
  //  '/usr/local/bin/node',
  //  '/home/jf/.npm-packages/bin/baldr-media-server-cli'
  // ]
  if (process.argv.length <= 2) {
    actionHelp()
  }
}

module.exports = {
  config
}

if (require.main === module) {
  main()
}
