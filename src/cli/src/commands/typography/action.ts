// Third party packages.
import chalk from 'chalk'

// Project packages.
import { readFile, writeFile, walk } from '@bldr/media-manager'

/**
 * Fix some typographic issues, for example quotes “…” -> „…“.
 *
 * @param filePaths - An array of input files, comes from the commanders’
 *   variadic parameter `[files...]`.
 */
function action (filePaths: string[]): void {
  walk({
    everyFile (filePath) {
      console.log(chalk.green(filePath))
      let content = readFile(filePath)
      const before = content
      content = content.replace(/“([^“”]*)”/g, '„$1“')
      content = content.replace(/"([^"]*)"/g, '„$1“')

      // Spaces at the end
      content = content.replace(/[ ]*\n/g, '\n')
      // Delete multiple empty lines
      content = content.replace(/\n\n\n+/g, '\n\n')
      // One newline at the end
      content = content.replace(/(.)\n*$/g, '$1\n')
      const after = content

      if (before !== after) {
        console.log(chalk.red('before:'))
        console.log('„' + chalk.yellow(before) + '“')
        console.log(chalk.red('after:'))
        console.log('„' + chalk.green(after) + '“')
        writeFile(filePath, content)
      } else {
        console.log('No change')
        console.log('„' + chalk.blue(after) + '“')
      }
    }
  }, {
    path: filePaths
  })
}

export = action
