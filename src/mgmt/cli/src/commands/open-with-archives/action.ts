// Node packages.
import path from 'path'

// Third party packages.
import chalk from 'chalk'

// Project packages:
import { locationIndicator } from '@bldr/media-manager'
import { openWithFileManagerWithArchives } from '@bldr/media-server'

/**
 * Normalize the metadata files in the YAML format (sort, clean up).
 *
 * @param filePaths - An array of input files. This parameter comes from
 *   the commanders’ variadic parameter `[files...]`.
 * @param cmdObj - An object containing options as key-value pairs.
 *  This parameter comes from `commander.Command.opts()`
 */
function action (filePath: string, cmdObj: { [key: string]: any }): void {
  if (!filePath) {
    filePath = process.cwd()
  }
  const regex = /^[a-zA-Z0-9-_/]+$/g
  if (!regex.test(filePath)) {
    console.log(`The current working directory “${chalk.red(filePath)}” contains illegal characters.`)
    return
  }
  filePath = path.resolve(filePath)
  const presParentDir = locationIndicator.getPresParentDir(filePath)
  if (filePath !== presParentDir) {
    filePath = presParentDir
    console.log(chalk.red('Open parent folder instead'))
  }
  console.log(openWithFileManagerWithArchives(filePath, cmdObj.createDirs))
}

module.exports = action
