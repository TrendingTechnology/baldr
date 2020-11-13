// Node packages.
import path from 'path'
import childProcess from 'child_process'

// Third party packages.
import chalk from 'chalk'

// Project packages.
import { walk } from '@bldr/media-manager'

function buildOneFile (filePath: string) {
  const process = childProcess.spawnSync(
    'lualatex', ['--halt-on-error', '--shell-escape', filePath],
    { cwd: path.dirname(filePath) }
  )
  if (process.status === 0) {
    console.log(chalk.green('OK') + ' ' + filePath)
  } else {
    console.log(chalk.red('ERROR') + ' ' + filePath)
  }
}

/**
 * Build TeX files.
 *
 * @param filePaths - An array of input files, comes from the commanders’
 *   variadic parameter `[files...]`
 */
function action (filePaths: string[]): void {
  walk(buildOneFile, {
    path: filePaths,
    regex: 'tex'
  })
}

export = action
