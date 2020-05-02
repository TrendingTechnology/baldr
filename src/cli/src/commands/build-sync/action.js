// Node packages.
const childProcess = require('child_process')

// Globals.
const { config } = require('../../main.js')

/**
 *
 */
function action () {
  let result = childProcess.spawnSync('rsync', [
    '-av',
    '--delete',
    '--exclude', 'logs',
    `${config.mediaServer.sshAliasRemote}:${config.http.webRoot}/`,
    `${config.http.webRoot}/`
  ], { encoding: 'utf-8' })

  if (result.status !== 0) {
    console.log(result.stderr)
    throw new Error('Build sync failed.')
  }

  result = childProcess.spawnSync('chown', [
    '-R',
    `${config.http.webServerUser}:${config.http.webServerUser}`,
    config.http.webRoot
  ], { encoding: 'utf-8' })

  if (result.status !== 0) {
    console.log(result.stderr)
    throw new Error('Chown failed.')
  }

}

module.exports = action
