import { GenericError } from '@bldr/type-definitions'
import { getConfig } from '@bldr/config'
import { MongoDbClient } from '@bldr/mongodb-connector'
import { parse } from '@bldr/presentation-parser'
import { readFile } from '@bldr/file-reader-writer'
import { updateMediaServer } from '@bldr/api-wrapper'
import { walk } from '@bldr/media-manager'
import * as log from '@bldr/log'

const config = getConfig()

interface Options {
  resolve?: boolean
  checkUris?: boolean
}

/**
 * @param filePath - A file path.
 * @param cmdObj - An object containing options as key-value pairs.
 *  This parameter comes from `commander.Command.opts()`
 */
async function action (filePaths?: string, options?: Options): Promise<void> {
  const errors: { [filePath: string]: string } = {}
  const result = await updateMediaServer()
  log.infoAny(result)

  if (filePaths == null) {
    filePaths = config.mediaServer.basePath
  }

  let allUris: string[] | undefined

  if (options?.resolve == null || !options.resolve) {
    const mongoDbClient = new MongoDbClient()
    const database = await mongoDbClient.connect()
    allUris = await database.getAllAssetUris()
    await mongoDbClient.close()
  }

  await walk(
    {
      async presentation (filePath) {
        log.info('Parse presentation %s', [filePath])
        try {
          const presentation = parse(readFile(filePath))
          if (options?.resolve != null && options.resolve) {
            await presentation.resolve()
          } else if (allUris != null) {
            for (const uri of presentation.slides.mediaUris) {
              if (!allUris.includes(uri)) {
                throw new Error(`URI check failed for “${uri}”!`)
              }
            }
          }
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
