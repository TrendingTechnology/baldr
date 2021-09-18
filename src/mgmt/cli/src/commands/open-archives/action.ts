// Node packages.
import path from 'path'

// Third party packages.
import chalk from 'chalk'

// Project packages:
import { locationIndicator } from '@bldr/media-manager'
import { openArchivesInFileManager } from '@bldr/media-server'
import * as log from '@bldr/log'

interface CmdObj {
  createDirs: boolean
}

/**
 * Create a relative path in different base paths. Open this relative paths in
 * the file manager.
 *
 * @param filePaths - An array of input files. This parameter comes from
 *   the commanders’ variadic parameter `[files...]`.
 * @param cmdObj - An object containing options as key-value pairs.
 *  This parameter comes from `commander.Command.opts()`
 */
function action (filePath: string, cmdObj: CmdObj) {
  if (filePath != null) {
    filePath = process.cwd()
  }
  const regex = /^[a-zA-Z0-9-_/]+$/g
  if (!regex.test(filePath)) {
    log.info(
      'The current working directory “%s” contains illegal characters.',
      filePath
    )
    return
  }
  filePath = path.resolve(filePath)
  const presParentDir = locationIndicator.getPresParentDir(filePath)
  if (filePath !== presParentDir) {
    filePath = presParentDir
    log.info('Open parent folder instead')
  }
  console.log(openArchivesInFileManager(filePath, cmdObj.createDirs))
}
module.exports = action
