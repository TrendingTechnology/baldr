import fs from 'fs'

// Project packages.
import { walk } from '@bldr/media-manager'
import * as log from '@bldr/log'

function renameByRegex (filePath: string, { pattern, replacement }: any): void {
  const newFilePath = filePath.replace(pattern, replacement)
  if (filePath !== newFilePath) {
    log.info('\nRename:\n  old: %s \n  new: %s', [filePath, newFilePath])
    fs.renameSync(filePath, newFilePath)
  }
}

async function action (
  pattern: string,
  replacement: string,
  filePath: string
): Promise<void> {
  await walk(renameByRegex, {
    regex: /.*/,
    path: filePath,
    payload: { pattern, replacement }
  })
}

export = action
