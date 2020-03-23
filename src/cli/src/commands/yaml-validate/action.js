// Node packages.
const fs = require('fs')

// Third party packages.
const chalk = require('chalk')
const yaml = require('js-yaml')

// Project packages.
const mediaServer = require('@bldr/media-server')

/**
 * @param {String} filePath - The media file path.
 */
function validateYamlOneFile (filePath) {
  try {
    yaml.safeLoad(fs.readFileSync(filePath, 'utf8'))
    console.log(`${chalk.green('ok')}: ${chalk.yellow(filePath)}`)
  } catch (error) {
    console.log(`${chalk.red('error')}: ${chalk.red(error.name)}: ${error.message}`)
    throw new Error(error.name)
  }
}

/**
 * Validate YAML files.
 *
 * @param {String} files - The media file path.
 */
function action (files) {
  mediaServer.walk(validateYamlOneFile, {
    path: files,
    regex: 'yml'
  })
}

module.exports = action
