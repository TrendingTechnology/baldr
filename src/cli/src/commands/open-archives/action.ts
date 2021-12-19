// Node packages.
import path from 'path'

// Project packages.
import { locationIndicator } from '@bldr/media-manager'
import { openArchivesInFileManager } from '@bldr/rest-api'
import * as log from '@bldr/log'

interface Options {
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
function action (filePath: string, cmdObj: Options): void {
  if (filePath == null) {
    filePath = process.cwd()
  }
  const regex = /^[a-zA-Z0-9-_./]+$/g
  if (!regex.test(filePath)) {
    log.info(
      'The current working directory “%s” contains illegal characters.',
      [filePath]
    )
    return
  }
  filePath = path.resolve(filePath)
  const presParentDir = locationIndicator.getPresParentDir(filePath)
  if (presParentDir != null && filePath !== presParentDir) {
    filePath = presParentDir
    log.info('Open parent folder instead')
  }
  openArchivesInFileManager(filePath, cmdObj.createDirs)
}

export = action
