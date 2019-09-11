#! /usr/bin/env node

// Node packages.
const childProcess = require('child_process')

// Third party packages.
const commander = require('commander')

// Third party packages.
const { MediaServer, bootstrapConfig } = require('./index.js')

const config = bootstrapConfig()

let subcommand
let options
let searchString

function rsync (toRemote = false) {
  const local = `${config.basePath}/`
  const remote = `${config.sshAliasRemote}:${config.basePath}/`
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
  .command('flush').alias('f')
  .description('Remove all entries in the SQLite database.')
  .action(() => { subcommand = 'flush' })

commander
  .command('info').alias('i')
  .description('Show some debug messages.')
  .action(() => { subcommand = 'info' })

commander
  .command('list').alias('l')
  .description('List all media files.')
  .action(() => { subcommand = 'list' })

commander
  .command('open').alias('o')
  .description('Open the base directory in a file browser')
  .action(() => { subcommand = 'open' })

commander
  .command('query <search>').alias('q')
  .description('Query the SQLite database.')
  .option('-f, --file-name', 'Query by file name.')
  .option('-i, --id', 'Query by id (default)')
  .action((query, opts) => {
    subcommand = 'query'
    searchString = query
    options = opts
  })

commander
  .command('rename').alias('r')
  .description('Rename files, clean file names, remove all whitespaces and special characters')
  .action(() => { subcommand = 'rename' })

commander
  .command('rsync-from-remote').alias('from')
  .description('Rsync FROM the remote media server to the local.')
  .action(() => { subcommand = 'rsync-from-remote' })

commander
  .command('rsync-to-remote').alias('to')
  .description('Rsync from the local media server TO the remote.')
  .action(() => { subcommand = 'rsync-to-remote' })

commander
  .command('update').alias('u')
  .description('Update the SQLite database, add new entries, update the entries.')
  .action(() => { subcommand = 'update' })

commander
  .command('yaml').alias('y')
  .description('Create info files in the YAML format in the current working directory.')
  .action(() => { subcommand = 'yaml' })

commander.parse(process.argv)

function help () {
  console.log('Specify a subcommand.')
  commander.outputHelp()
  process.exit(1)
}

if (!subcommand) {
  help()
}

const mediaServer = new MediaServer(commander.basePath)

switch (subcommand) {
  case 'flush':
    mediaServer.flush()
    break

  case 'info':
    console.log(bootstrapConfig())
    break

  case 'list':
    console.log(mediaServer.list())
    break

  case 'open':
    const process = childProcess.spawn('xdg-open', [config.basePath], { detached: true })
    process.unref()
    break

  case 'query':
    if (options.fileName) {
      console.log(mediaServer.queryByFilename(searchString))
    } else {
      console.log(mediaServer.queryByID(searchString))
    }
    break

  case 'rename':
    mediaServer.rename()
    break

  case 'rsync-from-remote':
    rsync(false)
    break

  case 'rsync-to-remote':
    rsync(true)
    break

  case 'update':
    mediaServer.update()
    break

  case 'yaml':
    mediaServer.createInfoFiles()
    break

  default:
    help()
    break
}
