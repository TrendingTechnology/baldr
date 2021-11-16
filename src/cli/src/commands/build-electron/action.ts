// Node packages.
import fs from 'fs'
import path from 'path'

// Project packages.
import { CommandRunner } from '@bldr/cli-utils'
import { getConfig } from '@bldr/config'

const config = getConfig()

const appNames = ['lamp']

/**
 * @param appName - The name of the name. The must be the same
 *   as the parent directory.
 */
async function buildElectronApp (
  cmd: CommandRunner,
  appName: string
): Promise<void> {
  const appPath = path.join(config.localRepo, 'src', 'vue', 'apps', appName)
  if (!fs.existsSync(appPath)) {
    throw new Error(`App path doesn’t exist for app “${appName}”.`)
  }

  // eslint-disable-next-line
  const packageJson = require(path.join(appPath, 'package.json'))

  cmd.log(`${appName}: Install npm dependencies.`)
  await cmd.exec(['npx', 'lerna', 'bootstrap'], { cwd: config.localRepo })

  cmd.log(`${appName}: build the Electron app.`)
  await cmd.exec(['npm', 'run', 'build:electron'], { cwd: appPath })

  // await cmd.exec(['npm', 'run', 'install:deb'], { cwd: appPath })
  cmd.log(`${appName}: remove old .deb package.`)
  await cmd.exec(['apt', '-y', 'remove', `baldr-${appName}`])

  const version: string = packageJson.version
  cmd.log(`${appName}: install the .deb package.`)
  await cmd.exec([
    'dpkg',
    '-i',
    path.join(appPath, 'dist_electron', `baldr-${appName}_${version}_amd64.deb`)
  ])

  cmd.stopSpin()
}

/**
 * @param appName - The name of the app. The app name must be the same
 *   as the parent directory.
 */
async function action (appName: string): Promise<void> {
  const cmd = new CommandRunner({
    verbose: true
  })
  cmd.checkRoot()
  cmd.startSpin()
  try {
    if (appName == null) {
      for (const appName of appNames) {
        await buildElectronApp(cmd, appName)
      }
    } else {
      await buildElectronApp(cmd, appName)
    }
    cmd.stopSpin()
  } catch (error) {
    cmd.catch(error as Error)
  }
}

export = action
