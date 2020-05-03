// Node packages.
const path = require('path')

// Third party packages.
const chalk = require('chalk')
const fs = require('fs-extra')
const glob = require('glob')
const jsdoc = require('jsdoc-api')

// Project packages.
const { openWith } = require('@bldr/media-server')
const { execute } = require('@bldr/core-node')

// Globals.
const { config } = require('../../main.js')

function open () {
  openWith('xdg-open', path.join(config.doc.dest, 'index.html'))
}

function generateDocs () {
  execute('git', 'pull', { cwd: config.doc.src })
  console.log(`Source: ${chalk.yellow(config.doc.src)}`)

  console.log(`Destination: ${chalk.green(config.doc.dest)}`)
  fs.removeSync(config.doc.dest)

  const docFiles = glob.sync(`${config.doc.src}/**/*.@(js|vue)`, {
    ignore: [
      '**/node_modules/**',
      '**/test/**',
      '**/tests/**'
    ]
  })
  console.log(docFiles.length)

  jsdoc.renderSync({
    files: docFiles,
    pedantic: true, // Treat errors as fatal errors, and treat warnings as errors. Default: false.
    readme: path.join(config.doc.src, 'README.md'),
    configure: config.doc.configFile,
    destination: config.doc.dest
  })

  open()
}

function action (action) {
  if (action === 'open' || action === 'o') {
    open()
  } else if (action === 'generate' || action === 'g') {
    generateDocs()
  } else {
    console.log('Subcommands: open|o, generate|g')
  }
}

module.exports = action
