// Project packages.
import { operations, walk } from '@bldr/media-manager'

/**
 * Normalize the metadata files in the YAML format (sort, clean up).
 *
 * @param filePaths - An array of input files. This parameter comes from
 *   the commanders’ variadic parameter `[files...]`.
 */
async function action (filePaths: string[]): Promise<void> {
  await walk({
    presentation (filePath) {
      operations.normalizePresentationFile(filePath)
    }
  }, {
    path: filePaths
  })
}

export = action
