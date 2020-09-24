// Node packages.
const path = require('path')

// Project packages.
const { CommandRunner } = require('@bldr/cli-utils')

// Globals.
const { config } = require('../../main.js')

/**
 *
 */
async function action () {
  const appPath = path.join(config.localRepo, 'src', 'lamp')
  const cmd = new CommandRunner({ verbose: true })
  await cmd.exec('npm', 'run', 'serve:webapp', { cwd: appPath })
}

module.exports = action
