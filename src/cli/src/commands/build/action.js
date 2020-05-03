// Node packages.
const fs = require('fs')
const path = require('path')

// Third party packages.
const chalk = require('chalk')
const ora = require('ora')

// Project packages:
const { executeAsync } = require('@bldr/core-node')

// Globals.
const { config } = require('../../main.js')

const appNames = [
  'lamp',
  'seating-plan',
  'showroom',
  'songbook'
]

let spinner

/**
 * @param {String} appName - The name of the name. The must be the same
 *   as the parent directory.
 */
async function buildApp (appName) {
  const appPath = path.join(config.localRepo, 'src', appName)
  if (!fs.existsSync(appPath)) {
    throw new Error(`App path doesn’t exist for app “${appName}”.`)
  }
  spinner.text = `${appName}: build the Vue app.`
  await executeAsync('npm', 'run', 'build', { cwd: appPath })

  let destinationDir
  if (appName === 'lamp') {
    destinationDir = 'presentation'
  } else {
    destinationDir = appName
  }

  spinner.text = `${appName}: push the build to the remote HTTP server.`
  await executeAsync(
    'rsync',
    '-av',
    '--delete',
    '--usermap', `jf:${config.http.webServerUser}`,
    '--groupmap', `jf:${config.http.webServerGroup}`,
    `${appPath}/dist/`,
    `${config.mediaServer.sshAliasRemote}:${config.http.webRoot}/${destinationDir}/`
  )
}

/**
 * @param {String} appName - The name of the name. The must be the same
 *   as the parent directory.
 */
async function action (appName) {
  spinner = ora({ text: 'Build some Vue apps.', spinner: 'line' }).start()
  try {
    if (!appName) {
      for (let appName of appNames) {
        await buildApp(appName)
      }
    } else {
      await buildApp(appName)
    }
    spinner.stop()
  } catch (error) {
    spinner.stop()
    console.log(error)
    process.exit()
  }
}

module.exports = action
