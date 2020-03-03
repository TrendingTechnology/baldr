// Node packages.
const childProcess = require('child_process')

// Globals.
const { config } = require('../main.js')

/**
 * Open base path.
 */
function action () {
  const process = childProcess.spawn('xdg-open', [config.mediaServer.basePath], { detached: true })
  process.unref()
}

module.exports = {
  command: 'open',
  alias: 'o',
  checkExecutable: 'xdg-open',
  description: 'Open the base directory of the media server in the file manager.',
  action
}
