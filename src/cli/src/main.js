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
  cloze: {
    command: 'cloze [input]',
    alias: 'cl',
    checkExecutable: ['pdfinfo', 'pdf2svg', 'lualatex'],
    description: 'Generate from TeX files with cloze texts SVGs for baldr.',
  },
  color: {
    command: 'color',
    alias: 'co',
    description: 'Generate a GIMP color palette for Inkscape or GIMP.',
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
  'icon-font': {
    command: 'icon-font',
    alias: 'if',
    description: 'Download some material icons and build font files from this SVGs.'
  },
  'id-to-filename': {
    command: 'id-to-filename [input]',
    alias: 'i',
    description: 'Rename media assets after the id.',
  },
  'mirror-folder-structure': {
    command: 'mirror-folder-structure',
    alias: 'mfs',
    description: [
      'Mirror the folder structure of the media folder into the archive folder or vice versa.',
      'Only folders with two prefixed numbers followed by an underscore (for example “10_”) are mirrored.'
    ].join(' ')
  },
  multipart: {
    command: 'multipart <glob> <prefix>',
    alias: 'mp',
    description: 'Rename multipart assets.',
  },
  normalize: {
    command: 'normalize [media-asset]',
    alias: 'n',
    description: 'Normalize the meta data files in the YAML format (sort, clean up).'
  },
  'open-media': {
    command: 'open-media',
    alias: 'o',
    checkExecutable: 'xdg-open',
    description: 'Open the base directory of the media server in the file manager.'
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
  'presentation-template': {
    command: 'presentation',
    alias: 'p',
    checkExecutable: ['detex'],
    description: 'Create a presentation template from the assets of the current working directory named “Praesentation.baldr.yml”.'
  },
  'rename-regex': {
    command: 'rename-regex <pattern> <replacement> [path]',
    alias: 'rr',
    description: 'Rename files by regex. see String.prototype.replace()'
  },
  rename: {
    command: 'rename',
    alias: 'r',
    description: [
      'Rename and clean file names, remove all whitespaces and special characters.',
      'For example:',
      '“Heimat Games - Titelmusik.mp3” -> “Heimat-Games_Titelmusik.mp3”',
      '“Götterdämmerung.mp3” -> “Goetterdaemmerung.mp3”'
    ].join(' ')
  },
  songbook: {
    command: 'songbook',
    alias: 's',
    cmdObj: [
      [
        '-a, --group-alphabetically',
        'List the songs in an alphabetical tree.'
      ],
      [
        '-b, --base-path <base-path>',
        'Base path of a song collection.'
      ],
      [
        '-B, --projector-path <projector-path>',
        'Directory to store intermediate files for the projector app (*.svg, *.json],. Special value: “none”.'
      ],
      [
        '-P, --piano-path <piano-path>',
        'Directory to store intermediate files for the piano score (*.eps],. Special value: “none”.'
      ],
      [
        '-c, --clean',
        'Clean up (delete all generated files],'
      ],
      [
        '-F, --folder <folder>',
        'Process only the given song folder'
      ],
      [
        '-f, --force',
        'Rebuild all images'
      ],
      [
        '-i, --song-id <song-id>',
        'Process only the song with the given song ID (The parent song folder],.'
      ],
      [
        '-l, --list <song-id-list>',
        'Use a list of song IDs in a text file to specify which songs should be updated.'
      ],
      [
        '-p, --piano',
        'Generate the piano files only.'
      ],
      [
        '-s, --slides',
        'Generate the slides only.'
      ],
      [
        '-t, --page-turn-optimized',
        'Generate a page turn friendly piano score version.'
      ]
    ],
    description: 'Update the songbook library.',
    checkExecutable: [
      'mscore-to-vector.sh',
      'pdf2svg',
      'pdfcrop',
      'pdfinfo',
      'pdftops',
      'mscore'
    ]
  },
  'tex-to-markdown': {
    command: 'tex-to-markdown [input]',
    alias: 'tm',
    description: 'Convert TeX files to markdown.',
  },
  'titles-from-tex': {
    command: 'titles-from-tex [input]',
    alias: 'tf',
    description: 'TeX files to folder titles title.txt'
  },
  'titles-list': {
    command: 'titles-list [input]',
    alias: 't',
    description: 'List all hierarchical folder titles.',
  },
  'titles-to-tex': {
    command: 'titles-to-tex [input]',
    alias: 'tt',
    description: 'Replace the title section of the TeX files with metadata retrieved from the title.txt files.'
  },
  'video-preview': {
    command: 'video-preview [input] [second]',
    alias: 'v',
    description: 'Create video preview images',
  },
  wikidata: {
    command: 'wikidata <item-id> [firstname] [lastname]',
    alias: 'w',
    description: 'Query wikidata.org (currently there is only support for the master slide “person”).',
  },
  'yaml-validate': {
    command: 'yaml-validate [input]',
    alias: 'yv',
    description: 'Validate the yaml files.',
  },
  yaml: {
    command: 'yaml [input]',
    alias: 'y',
    description: 'Create info files in the YAML format in the current working directory.',
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
    // To be able to export some functions other than
    // the action function from the subcommands.
    if (typeof action === 'function') return action(cmdObj)
    return action.action(cmdObj)
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
