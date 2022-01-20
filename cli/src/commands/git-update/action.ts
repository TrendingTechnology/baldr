// Project packages.
import { CommandRunner } from '@bldr/cli-utils'
import { getConfig } from '@bldr/config'
import path from 'path'

const config = getConfig()

async function gitUpdate (cmd: CommandRunner, cwd: string): Promise<void> {
  try {
    await cmd.exec(['git', 'add', '-Av'], { cwd })
    await cmd.exec(['git', 'commit', '-m', 'Auto-commit'], {
      cwd
    })
    cmd.log(`Commiting changes in the local repository: ${cwd}.`)
  } catch (error) {
    cmd.log(`Nothing to commit in the local repository: ${cwd}.`)
  }

  cmd.log(`Pull remote changes into the local repository: ${cwd}.`)
  await cmd.exec(['git', 'pull'], { cwd })

  cmd.log(`Push local changes into the remote media repository: ${cwd}.`)
  await cmd.exec(['git', 'push'], { cwd })
}

export default async function action (): Promise<void> {
  const cmd = new CommandRunner({ verbose: true })
  cmd.startSpin()

  const computerSienceGithubPages = path.join(
    config.mediaServer.basePath,
    'Informatik',
    'github-pages'
  )

  await gitUpdate(cmd, computerSienceGithubPages)
  await gitUpdate(cmd, config.songbook.path)
  await gitUpdate(cmd, config.mediaServer.basePath)

  cmd.stopSpin()
}
