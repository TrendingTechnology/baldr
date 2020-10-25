// Node packages.
const path = require('path')

// Project packages.
const mediaServer = require('@bldr/media-server')
const { operations } = require('@bldr/media-manager')

/**
 * Rename files.
 *
 * @param {Array} files - An array of input files, comes from the commanders’
 *   variadic parameter `[files...]`.
 */
function action (files) {
  mediaServer.walk({
    all (oldPath) {
      operations.renameMediaAsset(oldPath)
    }
  }, {
    path: files
  })
}

module.exports = action
