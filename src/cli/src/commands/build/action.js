// Node packages.
const childProcess = require('child_process')
const fs = require('fs')
const path = require('path')

// Third party packages.
const chalk = require('chalk')

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
  let result = childProcess.spawnSync('npm', ['run', 'build'], {
    cwd: appPath,
    encoding: 'utf-8'
  })
  if (result.status !== 0) {
    console.log(result.stderr)
    throw new Error(`Error building Vue app “${appName}”.`)
  }

  let destinationDir
  if (appName === 'lamp') {
    destinationDir = 'presentation'
  } else {
    destinationDir = appName
  }

  result = childProcess.spawnSync('rsync', [
    '-av',
    '--delete',
    '--usermap', `jf:${config.http.webServerUser}`,
    '--groupmap', `jf:${config.http.webServerGroup}`,
    `${appPath}/dist/`,
    `${config.mediaServer.sshAliasRemote}:${config.http.webRoot}/${destinationDir}/`
  ], { encoding: 'utf-8' })
  if (result.status !== 0) {
    console.log(result.stderr)
    throw new Error(`Error building Vue app “${appName}”.`)
  }
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
