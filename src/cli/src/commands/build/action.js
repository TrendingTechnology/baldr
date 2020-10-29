// Node packages.
const fs = require('fs')
const path = require('path')

// Project packages:
const { CommandRunner } = require('@bldr/cli-utils')
const config = require('@bldr/config')

const appNames = [
  'lamp',
  'seating-plan',
  'showroom',
  'songbook'
]

/**
 * @param {String} appName - The name of the name. The must be the same
 *   as the parent directory.
 */
async function buildApp (cmd, appName) {
  const appPath = path.join(config.localRepo, 'src', appName)
  if (!fs.existsSync(appPath)) {
    throw new Error(`App path doesn’t exist for app “${appName}”.`)
  }
  cmd.log(`${appName}: build the Vue app.`)
  await cmd.exec(['npm', 'run', 'build:webapp'], { cwd: appPath })

  let destinationDir
  if (appName === 'lamp') {
    destinationDir = 'presentation'
  } else {
    destinationDir = appName
  }

  cmd.log(`${appName}: push the build to the remote HTTP server.`)
  await cmd.exec(
    [
      'rsync',
      '-av',
      '--delete',
      '--usermap', `jf:${config.http.webServerUser}`,
      '--groupmap', `jf:${config.http.webServerGroup}`,
      `${appPath}/dist/`,
      `${config.mediaServer.sshAliasRemote}:${config.http.webRoot}/${destinationDir}/`
    ]
  )
  cmd.stopSpin()
}

/**
 * @param {String} appName - The name of the name. The must be the same
 *   as the parent directory.
 */
async function action (appName) {
  const cmd = new CommandRunner()
  cmd.startSpin()
  try {
    if (!appName) {
      for (let appName of appNames) {
        await buildApp(cmd, appName)
      }
    } else {
      await buildApp(cmd, appName)
    }
    cmd.stopSpin()
  } catch (error) {
    cmd.catch(error)
  }
}

module.exports = action
