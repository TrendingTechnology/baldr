// Project packages.
const { CommandRunner } = require('@bldr/cli-utils')

const { config } = require('../../main.js')
const syncBuilds = require('../build-sync/action.js')
const buildVueApp = require('../build/action.js')

/**
 *
 */
async function action (what, cmdObj) {
  const cmd = new CommandRunner()
  cmd.checkRoot()

  cmd.startSpin()

  opts = {
    remote: true,
    local: true,
    api: true,
    config: true,
    media: true,
    vue: true
  }

  if (what === 'api') {
    opts.config = false
    opts.media = false
    opts.vue = false
  } else if (what === 'config') {
    opts.api = false
    opts.media = true
    opts.vue = false
  } else if (what === 'media') {
    opts.api = false
    opts.config = false
    opts.vue = false

  } else if (what === 'vue') {
    opts.api = false
    opts.config = false
    opts.media = false
  }

  if (cmdObj.onlyRemote) {
    opts.local = false
  }

  if (cmdObj.onlyLocal) {
    opts.remote = false
  }

  // config
  if (opts.local && opts.config) {
    cmd.log('Updating the configuration locally using ansible.')
    await cmd.exec('/usr/local/bin/ansible-playbook-localhost.sh', 'b/baldr-config')
  }

  if (opts.remote && opts.config) {
    cmd.log('Updating the configuration remotely using ansible.')
    await cmd.exec('ssh', config.mediaServer.sshAliasRemote, `\"/usr/local/bin/ansible-playbook-localhost.sh b/baldr-config\"`)
  }

  // api
  if (opts.local && opts.api) {
    const result = await cmd.exec('git', 'status', '--porcelain', { cwd: config.localRepo })
    // For example:
    //  M src/cli-utils/main.js\n M src/cli/src/commands/update/action.js\n
    if (result.stdout) {
      console.log(`Git repo is not clean: ${config.localRepo}`)
      console.log(result.stdout)
      process.exit(1)
    }
    cmd.log('Updating the local BALDR repository.')
    await cmd.exec('git', 'pull', { cwd: config.localRepo })

    cmd.log('Installing missing node packages in the local BALDR repository.')
    await cmd.exec('npx', 'lerna', 'bootstrap', { cwd: config.localRepo })

    cmd.log('Restarting the systemd service named “baldr_api.service” locally.')
    await cmd.exec('systemctl', 'restart', 'baldr_api.service')
  }

  if (opts.remote && opts.api) {
    cmd.log('Updating the remote BALDR repository.')
    await cmd.exec('ssh', config.mediaServer.sshAliasRemote, `\"cd ${config.localRepo}; git pull\"`)

    cmd.log('Installing missing node packages in the remote BALDR repository.')
    await cmd.exec('ssh', config.mediaServer.sshAliasRemote, `\"cd ${config.localRepo}; npx lerna bootstrap\"`)

    cmd.log('Restarting the systemd service named “baldr_api.service” remotely.')
    await cmd.exec('ssh', config.mediaServer.sshAliasRemote, '\"systemctl restart baldr_api.service\"')
  }

  // vue
  if (opts.vue) {
    cmd.stopSpin()
    await buildVueApp('lamp')
    await syncBuilds()
    cmd.startSpin()
  }

  // media
  if (opts.local && opts.media) {
    cmd.log('Commiting local changes in the media repository.')
    await cmd.exec('git', 'add', '-Av', { cwd: config.mediaServer.basePath })
    try {
      await cmd.exec('git', 'commit', '-m', 'Auto-commit', { cwd: config.mediaServer.basePath })
    } catch (error) { }

    cmd.log('Pull remote changes into the local media repository.')
    await cmd.exec('git', 'pull', { cwd: config.mediaServer.basePath })

    cmd.log('Push local changes into the remote media repository.')
    await cmd.exec('git', 'push', { cwd: config.mediaServer.basePath })

    cmd.log('Updating the local MongoDB database.')
    await cmd.exec('curl', 'http://localhost/api/media/mgmt/update')
  }

  if (opts.remote && opts.media) {
    cmd.log('Pull remote changes from the git server into the remote media repository.')
    await cmd.exec('ssh', config.mediaServer.sshAliasRemote, `\"cd ${config.mediaServer.basePath}; git add -Av; git reset --hard HEAD; git pull\"`)

    cmd.log('Updating the remote MongoDB database.')
    await cmd.exec(
      'curl',
      '-u', `${config.http.username}:${config.http.password}`,
      `https://${config.http.domainRemote}/api/media/mgmt/update`
    )
  }

  cmd.stopSpin()
}

module.exports = action
