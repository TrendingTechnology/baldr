// Node packages.
const fs = require('fs')

// Third party packages.
const chalk = require('chalk')

// Project packages.
const mediaServer = require('@bldr/media-server')

const lib = require('../../lib.js')

/**
 * @param {String} filePath - The media asset file path.
 */
async function downloadCover (filePath, cmdObj) {
  const yamlFile = `${filePath}.yml`
  const metaData = lib.loadYaml(yamlFile)
  console.log(metaData)

  if (metaData.cover_source) {
    const previewFile = `${filePath}_preview.jpg`
    lib.fetchFile(metaData.cover_source, previewFile)
  } else {
    console.log(chalk.red('No property “cover_source” found.'))
  }
}

/**
 * @param {Array} files - An array of input files, comes from the commanders’
 *   variadic parameter `[files...]`.
 */
function action (files, cmdObj) {
  mediaServer.walk({
    async asset (relPath) {
      if (fs.existsSync(`${relPath}.yml`)) {
        await downloadCover(relPath, cmdObj)
      }
    }
  }, {
    path: files
  })
}

module.exports = action
