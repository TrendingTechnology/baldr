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

console.log('Run git pull')
const gitPull = childProcess.spawnSync('git', ['pull'], { cwd: this.basePath, encoding: 'utf-8' })
console.log(gitPull.stderr)
console.log(gitPull.stdout)
if (gitPull.status !== 0) throw new Error(`git pull exits with an none zero status code.`)

function createInfoFiles () {
  const cwd = process.cwd()
  const files = this.glob_(cwd)
  for (const file of files) {
    const yamlFile = `${file}.yml`
    if (!fs.lstatSync(file).isDirectory() && !fs.existsSync(yamlFile)) {
      const metaData = new MetaData(file, this.basePath)
      const title = metaData.basename
        .replace(/_/g, ', ')
        .replace(/-/g, ' ')
        .replace(/Ae/g, 'Ä')
        .replace(/ae/g, 'ä')
        .replace(/Oe/g, 'Ö')
        .replace(/oe/g, 'ö')
        .replace(/Ue/g, 'Ü')
        .replace(/ue/g, 'ü')
      const yamlMarkup = `---
# path: ${metaData.path}
# filename: ${metaData.filename}
# extension: ${metaData.extension}
title: ${title}
id: ${metaData.basename}
`
      console.log(yamlMarkup)
      fs.writeFileSync(yamlFile, yamlMarkup)
    }
  }
}

function rename () {
  const cwd = process.cwd()
  const files = this.glob_(cwd)
  for (const oldPath of files) {
    console.log(oldPath)
    const newPath = oldPath
      .replace(/[,.] /g, '_')
      .replace(/ +- +/g, '_')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/-*_-*/g, '_')
      .replace(/Ä/g, 'Ae')
      .replace(/ä/g, 'ae')
      .replace(/Ö/g, 'Oe')
      .replace(/ö/g, 'oe')
      .replace(/Ü/g, 'Ue')
      .replace(/ü/g, 'ue')
      .replace(/ß/g, 'ss')
    if (oldPath !== newPath) {
      console.log(newPath)
      fs.renameSync(oldPath, newPath)
    }
  }
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
  .description('Open the base directory in a file browser.')
  .action(() => { subcommand = 'open' })

commander
  .command('query <search>').alias('q')
  .description('Query the SQLite database.')
  .option('-f, --file-name', 'Query by file name.')
  .option('-i, --id', 'Query by id (default)')
  .option('-p, --path', 'Search by path substring')
  .option('--id-sub', 'Search by id substring')
  .action((query, opts) => {
    subcommand = 'query'
    searchString = query
    options = opts
  })

commander
  .command('re-initialize-db').alias('ri')
  .description('Delete the SQLite db file and create a new one.')
  .action(() => { subcommand = 're-initialize-db' })

commander
  .command('rename').alias('r')
  .description('Rename files, clean file names, remove all whitespaces and special characters.')
  .action(() => { subcommand = 'rename' })

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
    } else if (options.id) {
      console.log(mediaServer.queryByID(searchString))
    } else if (options.path) {
      console.log(mediaServer.searchInPath(searchString))
    } else if (options.idSub) {
      console.log(searchString)
      console.log(mediaServer.searchInId(searchString))
    }
    break

  case 're-initialize-db':
      mediaServer.reInitializeDb()
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
