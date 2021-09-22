// Node packages.
import fs from 'fs'

// Project packages.
import { operations, walk, locationIndicator } from '@bldr/media-manager'
import { convertFromYamlRaw } from '@bldr/yaml'
import { GenericError } from '@bldr/type-definitions'
import { getExtension } from '@bldr/core-browser'
import * as log from '@bldr/log'

function validateYamlOneFile (filePath: string): void {
  try {
    convertFromYamlRaw(fs.readFileSync(filePath, 'utf8'))
    log.debug('%s: %s', log.colorize.green('ok'), filePath)
  } catch (error) {
    const e = error as GenericError
    log.error('%s: %s: %s', log.colorize.red('error'), e.name, e.message)
    throw new Error(e.name)
  }
}

interface CmdObj {
  wikidata: boolean
  parentPresDir: boolean
}

/**
 * Create the metadata YAML files.
 *
 * @param filePaths - An array of input files, comes from the
 *   commanders’ variadic parameter `[files...]`.
 */
async function action (filePaths: string[], cmdObj: CmdObj): Promise<void> {
  if (filePaths.length === 0) {
    filePaths = [process.cwd()]
  }
  if (cmdObj.parentPresDir) {
    const presParentDir = locationIndicator.getPresParentDir(filePaths[0])
    if (presParentDir != null) {
      log.info(
        'Run the normalization task on the parent presentation folder: %s',
        presParentDir
      )
      filePaths = [presParentDir]
    }
  }
  await walk(
    {
      async asset (filePath) {
        if (!fs.existsSync(`${filePath}.yml`)) {
          await operations.initializeMetaYaml(filePath)
        } else {
          await operations.normalizeMediaAsset(filePath, cmdObj)
        }
        operations.renameByRef(filePath)
      },
      everyFile (filePath) {
        const extension = getExtension(filePath)?.toLowerCase()
        if (extension != null && ['tex', 'yml', 'txt'].includes(extension)) {
          operations.fixTypography(filePath)
        }
        if (filePath.match(/\.yml$/i) != null) {
          validateYamlOneFile(filePath)
        }
      },
      presentation (filePath) {
        log.info('\nNormalize the presentation file “%s”', filePath)
        log.info('\nNew content:\n')
        log.info(operations.normalizePresentationFile(filePath))
      },
      tex (filePath) {
        log.info('\nPatch the titles of the TeX file “%s”', filePath)
        operations.patchTexTitles(filePath)
      }
    },
    {
      path: filePaths
    }
  )
}

export = action
