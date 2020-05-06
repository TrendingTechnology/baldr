// Project packages.
const { CommandRunner } = require('@bldr/cli-utils')

const { config } = require('../../main.js')

/**
 *
 */
async function action () {
  const cmd = new CommandRunner()
  cmd.startSpin()
  cmd.log('git pull')
  await cmd.exec('git', 'pull', { cwd: config.localRepo })
  cmd.stopSpin()
}

module.exports = action
