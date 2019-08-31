#! /usr/bin/env node

// Third party packages.
const commander = require('commander')

const { setup, update, list } = require('./index.js')

let subcommand

commander
  .version(require('../package.json').version)
  .option('--base-path <base-path>')

commander
  .command('update')
  .alias('u')
  .action(() => { subcommand = 'update' })

commander
  .command('list')
  .alias('l')
  .action(() => { subcommand = 'list' })

commander.parse(process.argv)

if (commander.basePath) {
  setup(commander.basePath)
}

if (subcommand === 'update') {
  update()
} else if (subcommand === 'list') {
  list()
}
