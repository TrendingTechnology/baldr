// Node packages.
const childProcess = require('child_process')
const fs = require('fs')
const path = require('path')

// Third party packages.
const chalk = require('chalk')

// Project packages:
const { execute } = require('@bldr/core-node')

// Globals.
const { config } = require('../../main.js')

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
function buildApp (appName) {
  const appPath = path.join(config.localRepo, 'src', appName)
  if (!fs.existsSync(appPath)) {
    throw new Error(`App path doesn’t exist for app “${appName}”.`)
  }
  console.log(`Start building app: ${chalk.green(appName)}.`)
  execute('npm', 'run', 'build', { cwd: appPath })

  let destinationDir
  if (appName === 'lamp') {
    destinationDir = 'presentation'
  } else {
    destinationDir = appName
  }

  execute(
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
function action (appName) {
  if (!appName) {
    for (let appName of appNames) {
      buildApp(appName)
    }
  } else {
    buildApp(appName)
  }
}

module.exports = action
