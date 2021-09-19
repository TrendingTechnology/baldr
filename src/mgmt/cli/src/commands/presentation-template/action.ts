// Node packages.
import fs from 'fs'
import path from 'path'

// Project packages.
import { locationIndicator, operations } from '@bldr/media-manager'
import * as log from '@bldr/log'

interface CmdObj {
  force: boolean
}

/**
 * @param filePath - A file path.
 * @param cmdObj - An object containing options as key-value pairs.
 *  This parameter comes from `commander.Command.opts()`
 */
async function action (filePath?: string, cmdObj?: CmdObj): Promise<void> {
  if (filePath == null) {
    filePath = process.cwd()
  } else {
    const stat = fs.statSync(filePath)
    if (!stat.isDirectory()) {
      filePath = path.dirname(filePath)
    }
  }
  filePath = locationIndicator.getPresParentDir(filePath)

  if (filePath == null) {
    throw new Error('You are not in a presentation folder!')
  }

  filePath = path.resolve(path.join(filePath, 'Praesentation.baldr.yml'))
  if (!fs.existsSync(filePath) || (cmdObj?.force != null && cmdObj?.force)) {
    log.info('Presentation template created at: %s', filePath)
  } else {
    filePath = filePath.replace('.baldr.yml', '_tmp.baldr.yml')
    log.info(
      'Presentation already exists, create tmp file: %s',
      log.colorize.red(filePath)
    )
  }

  await operations.generatePresentation(filePath)
}

module.exports = action
