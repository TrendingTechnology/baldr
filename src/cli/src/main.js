#! /usr/bin/env node

// Node packages.
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

/**
 * (Sub)command defintions.
 *
 * @type {Object}
 */
const subCommands = {
  api: {
    command: 'api [port]',
    alias: 'a',
    description: 'Launch the REST API server. Specifiy a port to listen to if you what a different one than the default one.'
  },
  audacity: {
    command: 'audacity <text-mark-file>',
    alias: 'au',
    description: [
      'Convert a Audacity text mark file into a YAML file.',
      'Use the keyboard shortcuts ctrl+b or ctrl+m to create text marks in the software Audacity.',
      'Go to the text mark manager (Edit > text marks) to export the marks.'
    ].join(' ')
  },
  cloze:  {
    command: 'cloze [input]',
    alias: 'cl',
    checkExecutable: ['pdfinfo', 'pdf2svg', 'lualatex'],
    description: 'Generate from TeX files with cloze texts SVGs for baldr.',
  },
  convert: {
    command: 'convert [input...]',
    alias: 'c',
    options: [
      ['-p, --preview-image', 'Convert into preview images (Smaller and different file name)']
    ],
    description: 'Convert media files in the appropriate format. Multiple files, globbing works *.mp3',
    checkExecutable: ['ffmpeg', 'magick']
  },
  'mirror-folder-structure': {
    command: 'mirror-folder-structure',
    alias: 'mfs',
    description: [
      'Mirror the folder structure of the media folder into the archive folder or vice versa.',
      'Only folders with two prefixed numbers followed by an underscore (for example “10_”) are mirrored.'
    ].join(' ')
  },
  'open-with-archives': {
    command: 'open-with-archives',
    alias: 'owa',
    options: [
      ['-c, --create-dirs', 'Create missings directories of the relative path, if they are not existent.']
    ],
    checkExecutable: 'xdg-open',
    description: 'Create a relative path in different base paths. Open this relative paths in the file manager.',
  },
  'title-tex': {
    command: 'title-tex [input]',
    alias: 'tt',
    description: 'Replace the title section of the TeX files with metadata retrieved from the title.txt files.'
  }
}

const program = new commander.Command()
program.on('command:*', function () {
  console.error('Invalid command: %s\nSee --help for a list of available commands.', program.args.join(' '))
  process.exit(1)
})

/**
 * We use a closure to be able te require the subcommands ad hoc on invocation.
 * To avoid long loading times by many subcommands.
 *
 * @param {String} fileName
 */
function actionHandler (commandName) {
  return function (cmdObj) {
    const action = require(path.join(commandsPath, `${commandName}.js`))
    return action(cmdObj)
  }
}

/**
 * Load all (sub)commands.
 *
 * @param {Object} program - An instance of the package “program”.
 */
function loadCommands (program) {
  for (const commandName in subCommands) {
    const conf = subCommands[commandName]
    if (conf.checkExecutable) {
      checkExecutables(conf.checkExecutable)
    }
    const subProgramm = program.command(conf.command)
    if (conf.alias) {
      if (!aliases.includes(conf.alias)) {
        subProgramm.alias(conf.alias)
        aliases.push(conf.alias)
      } else {
        throw new Error(`Duplicate alias “${conf.alias}” used for the (sub)command “${conf.command}”.`)
      }
    }
    subProgramm.description(conf.description)
    if (conf.options) {
      for (const option of conf.options) {
        subProgramm.option(option[0], option[1])
      }
    }
    subProgramm.action(actionHandler(commandName))
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
