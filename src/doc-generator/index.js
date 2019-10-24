#! /usr/bin/env node

/**
 * JSDoc generator for all baldr packages.
 *
 * @module @bldr/doc-generator
 */

const glob = require('glob')
const path = require('path')
const childProcess = require('child_process')

const jsdoc = require('jsdoc-api')
const chalk = require('chalk')

const source = '/home/jf/git-repositories/github/Josef-Friedrich/baldr'
console.log(`Source: ${chalk.yellow(source)}`)

const destination = '/var/data/baldr/gh-pages'
console.log(`Destination: ${chalk.green(destination)}`)

const docFiles = glob.sync(`${source}/**/*.@(js|vue)`, {
  ignore: [
    '**/node_modules/**',
    '**/test/**',
    '**/tests/**'
  ]
})
console.log(docFiles.length)

jsdoc.renderSync({
  files: docFiles,
  configure: path.join(__dirname, 'jsdoc-config.json'),
  destination
})

const process = childProcess.spawn(
  'xdg-open',
  [path.join(destination, 'index.html')],
  { detached: true }
)
process.unref()
