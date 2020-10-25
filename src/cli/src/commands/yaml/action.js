// Project packages.
const mediaServer = require('@bldr/media-server')
const { operations } = require('@bldr/media-manager')

/**
 * Create the metadata YAML files.
 *
 * @param {Array} files - An array of input files, comes from the commanders’
 *   variadic parameter `[files...]`.
 */
function action (files) {
  mediaServer.walk({
    async asset (relPath) {
      await operations.initializeMetaYaml(relPath)
    }
  }, {
    path: files
  })
}

module.exports = action
