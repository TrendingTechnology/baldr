// Project packages.
const { CommandRunner } = require('@bldr/cli-utils')

const { config } = require('../../main.js')

/**
 *
 */
async function action () {
  const cmd = new CommandRunner()
  cmd.checkRoot()
  const result = await cmd.exec('git', 'status', '--porcelain', { cwd: config.localRepo })
  // For example:
  //  M src/cli-utils/main.js\n M src/cli/src/commands/update/action.js\n
  if (result.stdout) {
    console.log(`Git repo is not clean: ${config.localRepo}`)
    console.log(result.stdout)
    process.exit(1)
  }

  cmd.startSpin()

  cmd.log('git pull')
  await cmd.exec('git', 'pull', { cwd: config.localRepo })

  cmd.log('lerna bootstrap')
  await cmd.exec('npx', 'lerna', 'bootstrap', { cwd: config.localRepo })

  cmd.log('Restart systemd service “baldr_api.service”')
  await cmd.exec('systemctl', 'restart', 'baldr_api.service')

  cmd.stopSpin()
}

module.exports = action
