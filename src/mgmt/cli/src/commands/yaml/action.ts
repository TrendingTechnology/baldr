// Project packages.
import { operations, walk } from '@bldr/media-manager'

/**
 * Create the metadata YAML files.
 *
 * @param filePaths - An array of input files, comes from the
 *   commanders’ variadic parameter `[files...]`.
 */
function action (filePaths: string[]) {
  walk({
    async asset (relPath) {
      await operations.initializeMetaYaml(relPath)
    }
  }, {
    path: filePaths
  })
}

module.exports = action
