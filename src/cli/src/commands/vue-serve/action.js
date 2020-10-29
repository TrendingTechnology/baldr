// Node packages.
const path = require('path')

// Project packages.
const { CommandRunner } = require('@bldr/cli-utils')
const config = require('@bldr/config')

/**
 * @param {String} appName The name of the Vue app = parent folder of the app.
 */
async function action (appName = 'lamp') {
  const appPath = path.join(config.localRepo, 'src', appName)
  const cmd = new CommandRunner({ verbose: true })
  await cmd.exec(['npm', 'run', 'serve:webapp'], { cwd: appPath })
}

module.exports = action
