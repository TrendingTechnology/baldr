// Node packages.
import fs from 'fs'

// Project packages.
import { operations, walk } from '@bldr/media-manager'

/**
 * Normalize the metadata files in the YAML format (sort, clean up).
 *
 * @param filePaths - An array of input files. This parameter comes from
 *   the commanders’ variadic parameter `[files...]`.
 * @param cmdObj - An object containing options as key-value pairs.
 *  This parameter comes from `commander.Command.opts()`
 */
function action (filePaths: string[], cmdObj: { [key: string]: any, wikidata: any }) {
  walk({
    async asset (relPath) {
      if (fs.existsSync(`${relPath}.yml`)) {
        await operations.normalizeMediaAsset(relPath, cmdObj)
      }
    }
  }, {
    path: filePaths
  })
}

export = action
