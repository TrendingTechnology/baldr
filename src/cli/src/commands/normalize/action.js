// Node packages.
const fs = require('fs')

// Project packages.
const mediaServer = require('@bldr/media-server')
const { operations } = require('@bldr/media-manager')

/**
 * @param {Array} files - An array of input files, comes from the commanders’
 *   variadic parameter `[files...]`.
 */
function action (files, cmdObj) {
  mediaServer.walk({
    async asset (relPath) {
      if (fs.existsSync(`${relPath}.yml`)) {
        await operations.normalizeMediaAsset(relPath, cmdObj)
      }
    }
  }, {
    path: files
  })
}

module.exports = action
