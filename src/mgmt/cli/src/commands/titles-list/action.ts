// Third party packages.
import chalk from 'chalk'

// Project packages.
import { walk } from '@bldr/media-manager'
import { DeepTitle } from '@bldr/titles'

function read (filePath: string): void {
  console.log(filePath)
  const titles = new DeepTitle(filePath)
  console.log(`  id: ${chalk.cyan(titles.id)}`)
  console.log(`  title: ${chalk.yellow(titles.title)}`)
  if (titles.subtitle == null) console.log(`  subtitle: ${chalk.green(titles.subtitle)}`)
  console.log(`  grade: ${chalk.blue(titles.grade)}`)
  console.log(`  curriculum: ${chalk.red(titles.curriculum)}\n`)
}

/**
 * List all hierarchical (deep) folder titles.
 *
 * @param {Array} filePaths - An array of input files, comes from the commanders’
 *   variadic parameter `[files...]`.
 */
async function action (filePaths: string[]): Promise<void> {
  await walk({
    presentation (relPath) {
      read(relPath)
    }
  }, {
    path: filePaths
  })
}

module.exports = action
