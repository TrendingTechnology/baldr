import { operations } from '@bldr/media-manager'

interface CmdObj {
  force: boolean
}

/**
 * @param filePath - A file path.
 * @param cmdObj - An object containing options as key-value pairs.
 *  This parameter comes from `commander.Command.opts()`
 */
async function action (filePath?: string, cmdObj?: CmdObj): Promise<void> {
  await operations.generateAutomaticPresentation(filePath, cmdObj?.force)
}

module.exports = action
