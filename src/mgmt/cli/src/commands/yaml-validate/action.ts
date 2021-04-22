// Node packages.
import fs from 'fs'

// Third party packages.
import chalk from 'chalk'

// Project packages.
import { walk } from '@bldr/media-manager'
import { convertFromYamlRaw } from '@bldr/yaml'
import { GenericError } from '@bldr/type-definitions'

/**
 * @param filePath - The media file path.
 */
function validateYamlOneFile (filePath: string): void {
  try {
    convertFromYamlRaw(fs.readFileSync(filePath, 'utf8'))
    console.log(`${chalk.green('ok')}: ${chalk.yellow(filePath)}`)
  } catch (error) {
    const e = error as GenericError
    console.log(`${chalk.red('error')}: ${chalk.red(e.name)}: ${e.message}`)
    throw new Error(error.name)
  }
}

/**
 * Validate YAML files.
 *
 * @param filePaths - The media file path.
 */
async function action (filePaths: string[]): Promise<void> {
  await walk(validateYamlOneFile, {
    path: filePaths,
    regex: 'yml'
  })
}

export = action
