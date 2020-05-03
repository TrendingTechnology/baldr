// Node packages.
const os = require('os')

// Project packages.
const { CommandRunner } = require('@bldr/cli-utils')

// Globals.
const { config } = require('../../main.js')

/**
 *
 */
async function action () {
  const user = os.userInfo()
  if (user.username !== 'root') {
    console.error(`You need to be root: sudo /usr/local/bin/baldr bs`)
    process.exit()
  }
  const cmd = new CommandRunner()
  cmd.startSpin()

  cmd.log('rsync')
  await cmd.exec(
    'rsync',
    '-av',
    '--delete',
    '--exclude', 'logs',
    `${config.mediaServer.sshAliasRemote}:${config.http.webRoot}/`,
    `${config.http.webRoot}/`
  )

  cmd.log('chown')
  await cmd.exec(
    'chown',
    '-R',
    `${config.http.webServerUser}:${config.http.webServerUser}`,
    config.http.webRoot
  )
  cmd.stopSpin()
}

module.exports = action
