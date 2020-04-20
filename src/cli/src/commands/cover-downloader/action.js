// Node packages.
const fs = require('fs')
const path = require('path')
const URL = require('url').URL

// Third party packages.
const yaml = require('js-yaml')
const chalk = require('chalk')
const fetch = require('node-fetch')

// Project packages.
const mediaServer = require('@bldr/media-server')

const lib = require('../../lib.js')

/**
 * @param {String} url
 * @param {String} dest
 */
async function fetchFile (url, dest) {
  const response = await fetch(new URL(url))
  fs.mkdirSync(path.dirname(dest), { recursive: true })
  fs.writeFileSync(dest, Buffer.from(await response.arrayBuffer()))
}

/**
 * @param {String} filePath - The media asset file path.
 */
async function downloadCover (filePath, cmdObj) {
  const yamlFile = `${filePath}.yml`
  const metaData = yaml.safeLoad(lib.readFile(yamlFile))
  console.log(metaData)

  if (metaData.cover_source) {
    const previewFile = `${filePath}_preview.jpg`
    fetchFile(metaData.cover_source, previewFile)
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
