// Node packages.
import fs from 'fs'

// Project packages.
import { operations, walk } from '@bldr/media-manager'
import { convertFromYamlRaw } from '@bldr/yaml'
import type { GenericError } from '@bldr/type-definitions'
import * as log from '@bldr/log'
interface CmdObj {
  wikidata: boolean
}

function validateYamlOneFile (filePath: string): void {
  try {
    convertFromYamlRaw(fs.readFileSync(filePath, 'utf8'))
    log.debug('%s: %s', log.colorize.green('ok'), filePath)
  } catch (error) {
    const e = error as GenericError
    log.error('%s: %s: %s', log.colorize.red('error'), e.name, e.message)
    throw new Error(error.name)
  }
}

/**
 * Create the metadata YAML files.
 *
 * @param filePaths - An array of input files, comes from the
 *   commanders’ variadic parameter `[files...]`.
 */
async function action (filePaths: string[], cmdObj: CmdObj): Promise<void> {
  await walk({
    async asset (relPath) {
      if (!fs.existsSync(`${relPath}.yml`)) {
        await operations.initializeMetaYaml(relPath)
      } else {
        await operations.normalizeMediaAsset(relPath, cmdObj)
      }
    },
    everyFile (relPath) {
      if (relPath.match(/\.yml$/i) != null) {
        validateYamlOneFile(relPath)
      }
    }
  }, {
    path: filePaths
  })
}

export = action
