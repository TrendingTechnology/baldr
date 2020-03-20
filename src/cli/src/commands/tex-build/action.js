// Node packages.
const path = require('path')
const childProcess = require('child_process')

// Third party packages.
const chalk = require('chalk')

// Project packages.
const mediaServer = require('@bldr/api-media-server')

function buildOneFile (filePath) {
  let process = childProcess.spawnSync(
    'lualatex', ['--halt-on-error', '--shell-escape', filePath],
    { cwd: path.dirname(filePath) }
  )
  if (process.status === 0) {
    console.log(chalk.green('OK') + ' ' + filePath)
  } else {
    console.log(chalk.red('ERROR') + ' ' + filePath)
  }
}

/**
 * @param {Array} filesOrText - An array of input files, comes from the
 *   commanders’ variadic parameter `[files...]`
 */
function action (files) {
  mediaServer.walk(buildOneFile, {
    path: files,
    regex: 'tex'
  })
}

module.exports = action
