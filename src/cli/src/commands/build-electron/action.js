// Node packages.
const fs = require('fs')
const path = require('path')

// Project packages:
const { CommandRunner } = require('@bldr/cli-utils')
const config = require('@bldr/config')

const appNames = [
  'lamp'
]

/**
 * @param {String} appName - The name of the name. The must be the same
 *   as the parent directory.
 */
async function buildElectronApp (cmd, appName) {
  const appPath = path.join(config.localRepo, 'src', appName)
  if (!fs.existsSync(appPath)) {
    throw new Error(`App path doesn’t exist for app “${appName}”.`)
  }

  const packageJson = require(path.join(appPath, 'package.json'))

  cmd.log(`${appName}: Install npm dependencies.`)
  await cmd.exec(['npx', 'lerna', 'bootstrap'], { cwd: config.localRepo })

  cmd.log(`${appName}: build the Electron app.`)
  await cmd.exec(['npm', 'run', 'build:electron'], { cwd: appPath })

  // await cmd.exec(['npm', 'run', 'install:deb'], { cwd: appPath })
  cmd.log(`${appName}: remove old .deb package.`)
  await cmd.exec(['apt', '-y', 'remove', `baldr-${appName}`])

  cmd.log(`${appName}: install the .deb package.`)
  await cmd.exec(['dpkg', '-i', path.join(appPath, 'dist_electron', `baldr-${appName}_${packageJson.version}_amd64.deb`)])

  cmd.stopSpin()
}

/**
 * @param {String} appName - The name of the app. The app name must be the same
 *   as the parent directory.
 * @param {Object} cmdObj
 * @param {Object} globalOpts
 */
async function action (appName, cmdObj, globalOpts) {
  const cmd = new CommandRunner({
    verbose: true
  })
  cmd.checkRoot()
  cmd.startSpin()
  try {
    if (!appName) {
      for (const appName of appNames) {
        await buildElectronApp(cmd, appName)
      }
    } else {
      await buildElectronApp(cmd, appName)
    }
    cmd.stopSpin()
  } catch (error) {
    cmd.catch(error)
  }
}

module.exports = action
