// Node packages.
const fs = require('fs')

// Third party packages.
const yaml = require('js-yaml')

// Project packages.
const mediaServer = require('@bldr/api-media-server')
const lib = require('../lib.js')

// Globals.
const { cwd } = require('../main.js')

/**
 * @param {String} filePath - The media asset file path.
 */
function normalizeOneFile (filePath) {
  const yamlFile = `${filePath}.yml`
  const metaData = yaml.safeLoad(lib.readFile(yamlFile))
  lib.writeYamlFile(yamlFile, lib.normalizeMetaData(filePath, metaData))
}

/**
 * @param {String} filePath - The media asset file path.
 */
function action (filePath) {
  if (filePath) {
    normalizeOneFile(filePath)
  } else {
    mediaServer.walk(cwd, {
      asset (relPath) {
        if (fs.existsSync(`${relPath}.yml`)) {
          normalizeOneFile(relPath)
        }
      }
    })
  }
}

module.exports = {
  command: 'normalize [media-asset]',
  alias: 'n',
  description: 'Normalize the meta data files in the YAML format (sort, clean up).',
  action
}
