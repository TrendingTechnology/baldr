import { parseAndResolve } from '@bldr/presentation-parser'
import { readFile } from '@bldr/file-reader-writer'
import { walk } from '@bldr/media-manager'

/**
 * @param filePath - A file path.
 * @param cmdObj - An object containing options as key-value pairs.
 *  This parameter comes from `commander.Command.opts()`
 */
async function action (filePaths?: string): Promise<void> {
  await walk(
    {
      async presentation (presPath) {
        const presentation = await parseAndResolve(readFile(presPath))
        presentation.log()
      }
    },
    {
      path: filePaths
    }
  )
}

module.exports = action
