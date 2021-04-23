// Project packages.
import { operations, walk } from '@bldr/media-manager'

/**
 * Rename files.
 *
 * @param filePaths - An array of input files, comes from the
 *   commanders’ variadic parameter `[files...]`.
 */
async function action (filePaths: string[]): Promise<void> {
  await walk({
    all (oldPath) {
      operations.renameMediaAsset(oldPath)
    }
  }, {
    path: filePaths
  })
}

export = action
