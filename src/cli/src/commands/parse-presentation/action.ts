import { parseAndResolve } from '@bldr/presentation-parser'
import { GenericError } from '@bldr/type-definitions'

import { readFile } from '@bldr/file-reader-writer'
import { walk } from '@bldr/media-manager'
import * as log from '@bldr/log'

/**
 * @param filePath - A file path.
 * @param cmdObj - An object containing options as key-value pairs.
 *  This parameter comes from `commander.Command.opts()`
 */
async function action (filePaths?: string): Promise<void> {
  const errors: {[filePath: string]: string} = {}
  await walk(
    {
      async presentation (filePath) {
        log.info('Parse presentation %s', [filePath])
        try {
          const presentation = await parseAndResolve(readFile(filePath))
          presentation.log()
        } catch (e) {
          const error = e as GenericError
          log.error(error.message)
          errors[filePath] = error.message
        }
      }
    },
    {
      path: filePaths
    }
  )
  log.alwaysAny(errors)
}

module.exports = action
