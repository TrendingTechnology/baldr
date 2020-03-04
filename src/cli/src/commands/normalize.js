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
function normalizeMetaDataYamlOneFile (filePath) {
  const yamlFile = `${filePath}.yml`
  const metaData = yaml.safeLoad(fs.readFileSync(yamlFile, 'utf8'))
  lib.writeMetaDataYamlFile(yamlFile, lib.normalizeMetaData(filePath, metaData))
}

/**
 * @param {String} filePath - The media asset file path.
 */
function action (filePath) {
  if (filePath) {
    normalizeMetaDataYamlOneFile(filePath)
  } else {
    mediaServer.walk(cwd, {
      asset (relPath) {
        if (fs.existsSync(`${relPath}.yml`)) {
          normalizeMetaDataYamlOneFile(relPath)
        }
      }
    })
  }
}

module.exports = {
  command: 'normalize [input]',
  alias: 'n',
  description: 'Normalize the meta data files in the YAML format (Sort, clean up).',
  action
}
