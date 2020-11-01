// Node packages.
import fs from 'fs'
import path from 'path'

// Third party packages.
import chalk from 'chalk'

// Project packages.
import { locationIndicator, operations } from '@bldr/media-manager'

/**
 * @param filePath - A file path.
 * @param cmdObj - An object containing options as key-value pairs.
 *  This parameter comes from `commander.Command.opts()`
*/
async function action (filePath?: string, cmdObj?: { [key: string]: any }) {
  if (!filePath) {
    filePath = process.cwd()
  } else {
    const stat = fs.statSync(filePath)
    if (!stat.isDirectory()) {
      filePath = path.dirname(filePath)
    }
  }
  filePath = locationIndicator.getPresParentDir(filePath)

  filePath = path.resolve(path.join(filePath, 'Praesentation.baldr.yml'))
  console.log(filePath)
  if (!fs.existsSync(filePath) || cmdObj.force) {
    console.log(`Presentation template created at: ${chalk.green(filePath)}`)
  } else {
    filePath = filePath.replace('.baldr.yml', '_tmp.baldr.yml')
    console.log(`Presentation already exists, create tmp file: ${chalk.red(filePath)}`)
  }

  await operations.generatePresentation(filePath)
}

module.exports = action
