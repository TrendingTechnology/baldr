import { operations } from '@bldr/media-manager'

interface Options {
  force: boolean
}

/**
 * @param filePath - A file path.
 * @param cmdObj - An object containing options as key-value pairs.
 *  This parameter comes from `commander.Command.opts()`
 */
export default async function action (
  filePath?: string,
  cmdObj?: Options
): Promise<void> {
  await operations.generateAutomaticPresentation(filePath, cmdObj?.force)
}
