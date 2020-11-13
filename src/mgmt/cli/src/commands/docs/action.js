// Node packages.
const path = require('path')

// Third party packages.
const chalk = require('chalk')
const fs = require('fs-extra')
const glob = require('glob')
const jsdoc = require('jsdoc-api')

// Project packages.
const { openWith } = require('@bldr/media-server')
const { CommandRunner } = require('@bldr/cli-utils')
const config = require('@bldr/config')

function open () {
  openWith('xdg-open', path.join(config.doc.dest, 'index.html'))
}

async function generateDocs () {
  const cmd = new CommandRunner()
  cmd.startSpin()

  cmd.log(`Update source: ${chalk.yellow(config.doc.src)}`)
  await cmd.exec(['git', 'pull'], { cwd: config.doc.src })

  cmd.log(`Clean destination: ${chalk.green(config.doc.dest)}`)
  await fs.remove(config.doc.dest)

  const docFiles = glob.sync(`${config.doc.src}/**/*.@(js|vue)`, {
    ignore: [
      '**/node_modules/**',
      '**/test/**',
      '**/tests/**'
    ]
  })
  cmd.log(`Generate documentation of ${docFiles.length} files.`)

  jsdoc.renderSync({
    files: docFiles,
    pedantic: true, // Treat errors as fatal errors, and treat warnings as errors. Default: false.
    readme: path.join(config.doc.src, 'README.md'),
    configure: config.doc.configFile,
    destination: config.doc.dest
  })

  open()
  cmd.stopSpin()
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
