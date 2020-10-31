

// Project packages.
import { operations, walk } from '@bldr/media-manager'

/**
 * Convert multiple files.
 *
 * @param files - An array of input files to convert.
 * @param cmdObj - The command object from the commander.
 */
function action (files: string | string[], cmdObj: object) {
  walk({
    all: operations.convertAsset
  }, {
    path: files,
    payload: cmdObj
  })
}

export = action
