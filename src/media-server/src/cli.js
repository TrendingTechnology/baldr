#! /usr/bin/env node

// Node packages.
const childProcess = require('child_process')

// Third party packages.
const commander = require('commander')

// Third party packages.
const { MediaServer } = require('./index.js')

let subcommand
let options
let searchString

function rsync (toRemote = false) {
  const dir = '~/.local/share/baldr/media/'
  const local = dir
  const remote = `serverway:${dir}`
  const options = ['-av', '--delete', '--exclude', 'files.db']

  let args = []
  if (toRemote) {
    args = [...options, local, remote]
  } else {
    args = [...options, remote, local]
  }
  console.log('rsync ' + args.join(' '))
  const process = childProcess.spawnSync('rsync', args, { encoding: 'utf-8', shell: true })
  console.log(process.stdout)
  console.log(process.stderr)
}

commander
  .version(require('../package.json').version)
  .option('-b, --base-path <base-path>', 'A path where all there the media files are.')

commander
  .command('flush')
  .alias('f')
  .action(() => { subcommand = 'flush' })

commander
  .command('to-remote')
  .alias('to')
  .action(() => { subcommand = 'to-remote' })

commander
  .command('from-remote')
  .alias('from')
  .action(() => { subcommand = 'from-remote' })

commander
  .command('update')
  .alias('u')
  .action(() => { subcommand = 'update' })

commander
  .command('list')
  .alias('l')
  .action(() => { subcommand = 'list' })

commander
  .command('yaml')
  .alias('y')
  .action(() => { subcommand = 'yaml' })

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

if (subcommand === 'flush') {
  mediaServer.flush()
} else if (subcommand === 'update') {
  mediaServer.update()
} else if (subcommand === 'list') {
  console.log(mediaServer.list())
} else if (subcommand === 'query') {
  if (options.fileName) {
    console.log(mediaServer.queryByFilename(searchString))
  } else {
    console.log(mediaServer.queryByID(searchString))
  }
} else if (subcommand === 'yaml') {
  mediaServer.createInfoFiles()
} else if (subcommand === 'to-remote') {
  rsync(true)
} else if (subcommand === 'from-remote') {
  rsync(false)
}
