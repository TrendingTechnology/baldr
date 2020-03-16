// Node packages.
const childProcess = require('child_process')

// Project packages.
const mediaServer = require('@bldr/api-media-server')

// Globals.
const { cwd } = require('../main.js')

function action () {
  childProcess.spawn('zsh', ['-i'], {
    cwd: mediaServer.basePaths.getMirroredPath(cwd),
    stdio: 'inherit'
  })
}

module.exports = action
