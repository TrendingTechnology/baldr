#! /usr/bin/env node

// Node packages.
const childProcess = require('child_process')

// Third party packages.
const commander = require('commander')

// Third party packages.
const { MediaServer, bootstrapConfig } = require('./index.js')

let subcommand
let options
let searchString

function rsync (toRemote = false) {
  const config = bootstrapConfig()
  const local = config.basePathLocal
  const remote = `${config.sshAliasRemote}:${config.basePathRemote}`
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
  .description('Remove all entries in the SQLite database.')
  .alias('f')
  .action(() => { subcommand = 'flush' })

commander
  .command('list')
  .description('List all media files.')
  .alias('l')
  .action(() => { subcommand = 'list' })

commander
  .command('query <search>')
  .description('Query the SQLite database.')
  .option('-f, --file-name', 'Query by file name.')
  .option('-i, --id', 'Query by id (default)')
  .alias('q')
  .action((query, opts) => {
    subcommand = 'query'
    searchString = query
    options = opts
  })

commander
  .command('rsync-from-remote')
  .description('Rsync FROM the remote media server to the local.')
  .alias('from')
  .action(() => { subcommand = 'rsync-from-remote' })

commander
  .command('rsync-to-remote')
  .description('Rsync from the local media server TO the remote.')
  .alias('to')
  .action(() => { subcommand = 'rsync-to-remote' })

commander
  .command('update')
  .description('Update the SQLite database, add new entries, update the entries.')
  .alias('u')
  .action(() => { subcommand = 'update' })

commander
  .command('yaml')
  .description('Create info files in the YAML format in the current working directory.')
  .alias('y')
  .action(() => { subcommand = 'yaml' })

commander.parse(process.argv)

if (!subcommand) {
  console.log('Specify a subcommand.')
  commander.outputHelp()
  process.exit(1)
}

const mediaServer = new MediaServer(commander.basePath)

// flush
if (subcommand === 'flush') {
  mediaServer.flush()
// list
} else if (subcommand === 'list') {
  console.log(mediaServer.list())
// query
} else if (subcommand === 'query') {
  if (options.fileName) {
    console.log(mediaServer.queryByFilename(searchString))
  } else {
    console.log(mediaServer.queryByID(searchString))
  }
// rsync-from-remote
} else if (subcommand === 'rsync-from-remote') {
  rsync(false)
// rsync-to-remote
} else if (subcommand === 'rsync-to-remote') {
  rsync(true)
// update
} else if (subcommand === 'update') {
  mediaServer.update()
// yaml
} else if (subcommand === 'yaml') {
  mediaServer.createInfoFiles()
}
