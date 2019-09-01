#! /usr/bin/env node

// Third party packages.
const commander = require('commander')

// Third party packages.
const { MediaServer } = require('./index.js')

let subcommand
let options
let searchString

commander
  .version(require('../package.json').version)
  .option('-b, --base-path <base-path>', 'A path where all there the media files are.')

commander
  .command('update')
  .alias('u')
  .action(() => { subcommand = 'update' })

commander
  .command('list')
  .alias('l')
  .action(() => { subcommand = 'list' })

commander
  .command('query <search>')
  .option('-f, --file-name', 'Query by file name.')
  .option('-i, --id', 'Query by id (default)')
  .alias('q')
  .action((query, opts) => {
    subcommand = 'query'
    searchString = query
    options = opts
  })

commander.parse(process.argv)

if (!subcommand) {
  console.log('Specify a subcommand.')
  commander.outputHelp()
  process.exit(1)
}

const mediaServer = new MediaServer(commander.basePath)

if (subcommand === 'update') {
  mediaServer.update()
} else if (subcommand === 'list') {
  mediaServer.list()
} else if (subcommand === 'query') {
  if (options.fileName) {
    mediaServer.queryByFilename(searchString)
  } else {
    mediaServer.queryByID(searchString)
  }
}
