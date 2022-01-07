import path from 'path'
import childProcess from 'child_process'

import chalk from 'chalk'

// Project packages.
import { walk } from '@bldr/media-manager'
import * as log from '@bldr/log'

function buildOneFile (filePath: string): void {
  const process = childProcess.spawnSync(
    'lualatex', ['--halt-on-error', '--shell-escape', filePath],
    { cwd: path.dirname(filePath) }
  )
  if (process.status === 0) {
    log.info(chalk.green('OK') + ' ' + filePath)
  } else {
    log.info(chalk.red('ERROR') + ' ' + filePath)
  }
}

/**
 * Build TeX files.
 *
 * @param filePaths - An array of input files, comes from the commanders’
 *   variadic parameter `[files...]`
 */
async function action (filePaths: string[]): Promise<void> {
  await walk(buildOneFile, {
    path: filePaths,
    regex: 'tex'
  })
}

export = action
