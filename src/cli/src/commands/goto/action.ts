import childProcess from 'child_process'
import fs from 'fs'

// Project packages.
import { locationIndicator } from '@bldr/media-manager'
import { openInFileManager } from '@bldr/open-with'
import * as log from '@bldr/log'
import { getConfig } from '@bldr/config'

const config = getConfig()

interface Options {
  fileManager: boolean
}

function openShell (filePath: string): void {
  childProcess.spawn('zsh', ['-i'], {
    cwd: filePath,
    stdio: 'inherit'
  })
}

function action (cmdObj: Options): void {
  // In the archive folder are no two letter folders like 'YT'.
  // We try to detect the parent folder where the presentation lies in.
  const presDir = locationIndicator.getPresParentDir(process.cwd())
  if (presDir == null) {
    throw new Error('You are not in a presentation folder!')
  }
  let mirroredPath = locationIndicator.getMirroredPath(presDir)
  // If no mirrored path could be detected we show the base path of the
  // media server.
  if (mirroredPath == null) {
    mirroredPath = config.mediaServer.basePath
  }

  if (!fs.existsSync(mirroredPath)) {
    log.error('The path “%s” doesn’t exist.', [mirroredPath])
    process.exit(1)
  }

  log.info('Go to: %s', [mirroredPath])
  if (cmdObj.fileManager) {
    openInFileManager(mirroredPath, true)
  } else {
    openShell(mirroredPath)
  }
}

export = action
