// Node packages.
const childProcess = require('child_process')

// Globals.
const { config } = require('../../main.js')

/**
 * Open base path.
 */
function action () {
  const process = childProcess.spawn('xdg-open', [config.mediaServer.basePath], { detached: true })
  process.unref()
}

module.exports = action
