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
 * (Sub)command defintions.
 *
 * @type {Object}
 */
const subCommands = {
  convert: {
    command: 'convert [input...]',
    alias: 'c',
    options: [
      ['-p, --preview-image', 'Convert into preview images (Smaller and different file name)']
    ],
    description: 'Convert media files in the appropriate format. Multiple files, globbing works *.mp3',
    checkExecutable: ['ffmpeg', 'magick']
  },
  'title-tex': {
    command: 'title-tex [input]',
    alias: 'tt',
    description: 'Replace the title section of the TeX files with metadata retrieved from the title.txt files.',
  }
}

/**
 * We use a closure to be able te require the subcommands ad hoc on invocation.
 * To avoid long loading times by many subcommands.
 *
 * @param {String} fileName
 */
function actionHandler (commandName) {
  return function (cmdObj) {
    const { action } = require(path.join(commandsPath, `${commandName}.js`))
    return action(cmdObj)
  }
}

/**
 * Load all (sub)commands.
 *
 * @param {Object} commander - An instance of the package “commander”.
 */
function loadCommands (commander) {
  for (const commandName in subCommands) {

    const conf = subCommands[commandName]
    if (conf.checkExecutable) {
      checkExecutables(conf.checkExecutable)
    }
    const programm = commander.command(conf.command)
    if (conf.alias) {
      if (!aliases.includes(conf.alias)) {
        programm.alias(conf.alias)
        aliases.push(conf.alias)
      }
      else {
        throw new Error(`Duplicate alias “${conf.alias}” used for the (sub)command “${conf.command}”.`)
      }
    }
    programm.description(conf.description)
    if (conf.options) {
      for (const option of conf.options) {
        programm.option(option[0], option[1])
      }
    }
    programm.action(actionHandler(commandName))
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
  //commander.exitOverride()
  //commander.parse(process.argv)

  try {
    await commander.parseAsync(process.argv)
    // custom processing...
  } catch (error) {
    console.log(error)
    //process.exit()
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
