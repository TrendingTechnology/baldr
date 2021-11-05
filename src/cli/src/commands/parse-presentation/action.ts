import { GenericError } from '@bldr/type-definitions'
import { parseAndResolve } from '@bldr/presentation-parser'
import { readFile } from '@bldr/file-reader-writer'
import { updateMediaServer } from '@bldr/api-wrapper'
import { walk } from '@bldr/media-manager'
import * as log from '@bldr/log'

/**
 * @param filePath - A file path.
 * @param cmdObj - An object containing options as key-value pairs.
 *  This parameter comes from `commander.Command.opts()`
 */
async function action (filePaths?: string): Promise<void> {
  const errors: { [filePath: string]: string } = {}
  const result = await updateMediaServer()
  log.infoAny(result)
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
  if (Object.keys(errors).length === 0) {
    log.info('Congratulations! No parsing errors!')
  } else {
    log.error('Parsing errors')
    for (const filePath in errors) {
      if (Object.prototype.hasOwnProperty.call(errors, filePath)) {
        const message = errors[filePath]
        log.error('Error in file “%s”:\n    %s', [filePath, message])
      }
    }
  }
}

module.exports = action
