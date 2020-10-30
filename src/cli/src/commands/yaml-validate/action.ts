// Node packages.
import fs from 'fs'

// Third party packages.
import chalk from 'chalk'
import yaml from 'js-yaml'

// Project packages.
import { walk } from '@bldr/media-manager'

/**
 * @param filePath - The media file path.
 */
function validateYamlOneFile (filePath: string) {
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
  walk(validateYamlOneFile, {
    path: files,
    regex: 'yml'
  })
}

module.exports = action
