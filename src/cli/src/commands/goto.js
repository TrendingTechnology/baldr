// Node packages.
const childProcess = require('child_process')

// Project packages.
const mediaServer = require('@bldr/api-media-server')

// Globals.
const { cwd, config } = require('../main.js')

function action () {
  let mirroredPath = mediaServer.basePaths.getMirroredPath(cwd)
  if (!mirroredPath) mirroredPath = config.mediaServer.basePath
  childProcess.spawn('zsh', ['-i'], {
    cwd: mirroredPath,
    stdio: 'inherit'
  })
}

module.exports = action
