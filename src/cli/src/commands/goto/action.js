// Node packages.
const childProcess = require('child_process')

// Third party packages.
const chalk = require('chalk')

// Project packages.
const mediaServer = require('@bldr/media-server')

// Globals.
const { cwd, config } = require('../../main.js')

function action () {
  let mirroredPath = mediaServer.locationIndicator.getMirroredPath(cwd)
  if (!mirroredPath) mirroredPath = config.mediaServer.basePath
  console.log(`Go to: ${chalk.green(mirroredPath)}`)
  childProcess.spawn('zsh', ['-i'], {
    cwd: mirroredPath,
    stdio: 'inherit'
  })
}

module.exports = action
