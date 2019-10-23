#! /usr/bin/env node

/**
 * JSDoc generator for all baldr packages.
 *
 * @module @bldr/doc-generator
 */

const jsdoc = require('jsdoc-api')
const glob = require('glob')
const path = require('path')
const childProcess = require('child_process')

const destination = '/var/data/baldr/gh-pages'
//const source = '/var/data/baldr/src'
const source = '/home/jf/git-repositories/github/Josef-Friedrich/baldr'

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
  configure:  path.join(__dirname, 'jsdoc-config.json'),
  destination
})

const process = childProcess.spawn(
  'xdg-open',
  [path.join(destination, 'index.html')],
  { detached: true }
)
process.unref()
