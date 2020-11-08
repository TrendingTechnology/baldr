// Node packages.
import childProcess from 'child_process'
import fs from 'fs'

// Third party packages.
import chalk from 'chalk'

// Project packages.
import { locationIndicator } from '@bldr/media-manager'
import config from '@bldr/config'

function action () {
  // In the archive folder are no two letter folders like 'YT'.
  // We try to detect the parent folder where the presentation lies in.
  let presDir = locationIndicator.getPresParentDir(process.cwd())
  let mirroredPath = locationIndicator.getMirroredPath(presDir)
  // If no mirrored path could be detected we show the base path of the
  // media server.
  if (!mirroredPath) mirroredPath = config.mediaServer.basePath

  if (!fs.existsSync(mirroredPath)) {
    console.log(`The path “${chalk.red(mirroredPath)}” doesn’t exist.`)
    process.exit(1)
  }
  console.log(`Go to: ${chalk.green(mirroredPath)}`)
  childProcess.spawn('zsh', ['-i'], {
    cwd: mirroredPath,
    stdio: 'inherit'
  })
}

export = action
