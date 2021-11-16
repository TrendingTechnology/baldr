// Project packages.
import { CommandRunner } from '@bldr/cli-utils'
import { getConfig } from '@bldr/config'

const config = getConfig()

async function action (): Promise<void> {
  const cmd = new CommandRunner()
  cmd.checkRoot()
  cmd.startSpin()

  cmd.log('Pull the Vue builds from the remote web server.')
  await cmd.exec([
    'rsync',
    '-av',
    '--delete',
    '--exclude',
    'logs',
    `${config.mediaServer.sshAliasRemote}:${config.http.webRoot}/`,
    `${config.http.webRoot}/`
  ])

  cmd.log('Fixing the ownership of the Vue builds.')
  await cmd.exec([
    'chown',
    '-R',
    `${config.http.webServerUser}:${config.http.webServerUser}`,
    config.http.webRoot
  ])
  cmd.stopSpin()
}

export = action
