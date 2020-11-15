// Project packages.
import { operations, walk } from '@bldr/media-manager'

/**
 * Normalize the metadata files in the YAML format (sort, clean up).
 *
 * @param filePaths - An array of input files. This parameter comes from
 *   the commanders’ variadic parameter `[files...]`.
 */
function action (filePaths: string[]): void {
  walk({
    presentation (filePath) {
      operations.normalizePresentationFile(filePath)
    }
  }, {
    path: filePaths
  })
}

export = action
