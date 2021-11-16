// Node packages.
import fs from 'fs'
import path from 'path'

// Project packages.
import { CommandRunner } from '@bldr/cli-utils'
import { getConfig } from '@bldr/config'

const config = getConfig()

const appNames = ['lamp', 'seating-plan', 'showroom', 'songbook']

/**
 * @param appName - The name of the name. The must be the same
 *   as the parent directory.
 */
async function buildApp (cmd: CommandRunner, appName: string): Promise<void> {
  const appPath = path.join(config.localRepo, 'src', appName)
  if (!fs.existsSync(appPath)) {
    throw new Error(`App path doesn’t exist for app “${appName}”.`)
  }
  cmd.log(`${appName}: build the Vue app.`)
  await cmd.exec(['npm', 'run', 'build:webapp'], { cwd: appPath })

  let destinationDir: string
  if (appName === 'lamp') {
    destinationDir = 'presentation'
  } else {
    destinationDir = appName
  }

  cmd.log(`${appName}: push the build to the remote HTTP server.`)
  await cmd.exec([
    'rsync',
    '-av',
    '--delete',
    '--usermap',
    `jf:${config.http.webServerUser}`,
    '--groupmap',
    `jf:${config.http.webServerGroup}`,
    `${appPath}/dist/`,
    `${config.mediaServer.sshAliasRemote}:${config.http.webRoot}/${destinationDir}/`
  ])
  cmd.stopSpin()
}

/**
 * @param {String} appName - The name of the name. The must be the same
 *   as the parent directory.
 */
async function action (appName: string): Promise<void> {
  const cmd = new CommandRunner()
  cmd.startSpin()
  try {
    if (appName == null) {
      for (const appName of appNames) {
        await buildApp(cmd, appName)
      }
    } else {
      await buildApp(cmd, appName)
    }
    cmd.stopSpin()
  } catch (error) {
    cmd.catch(error as Error)
  }
}

export = action
