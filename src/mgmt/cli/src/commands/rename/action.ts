// Project packages.
import { operations, walk } from '@bldr/media-manager'

/**
 * Rename files.
 *
 * @param {Array} filePaths - An array of input files, comes from the
 *   commanders’ variadic parameter `[files...]`.
 */
function action (filePaths: string[]): void {
  walk({
    all (oldPath) {
      operations.renameMediaAsset(oldPath)
    }
  }, {
    path: filePaths
  })
}

export = action
