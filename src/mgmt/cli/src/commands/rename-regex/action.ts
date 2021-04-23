// Node packages.
import fs from 'fs'

// Third party packages.
import chalk from 'chalk'

// Project packages.
import { walk } from '@bldr/media-manager'

function renameByRegex (filePath: string, { pattern, replacement }: any): void {
  const newFilePath = filePath.replace(pattern, replacement)
  if (filePath !== newFilePath) {
    console.log(`\nRename:\n  old: ${chalk.yellow(filePath)} \n  new: ${chalk.green(newFilePath)}`)
    fs.renameSync(filePath, newFilePath)
  }
}

async function action (pattern: string, replacement: string, filePath: string): Promise<void> {
  await walk(renameByRegex, {
    regex: new RegExp('.*'),
    path: filePath,
    payload: { pattern, replacement }
  })
}

export = action
