// Node packages.
import fs from 'fs'

// Third party packages.
import chalk from 'chalk'

// Project packages.
import { convertTexToMd } from '@bldr/tex-markdown-converter'
import { readFile, locationIndicator, walk } from '@bldr/media-manager'

/**
 * @param input - A file path or a text string to convert.
 */
function convertTexToMarkdown (input: string): string {
  let content: string
  if (!fs.existsSync(input)) {
    content = input
  } else {
    console.log(chalk.green(locationIndicator.getRelPath(input)))
    content = readFile(input)
  }
  console.log('\n' + chalk.yellow('Original:') + '\n')
  console.log(content)
  content = convertTexToMd(content)
  console.log(chalk.green('Converted:'))
  console.log(content)
  return content
}

/**
 * Convert TeX to markdown.
 *
 * @param {Array} filesOrText - An array of input files, comes from the commanders’
 *   variadic parameter `[files...]` or a text block in the first element
 *   of the array.
 */
function action (filesOrText: string | string[]) {
  if (Array.isArray(filesOrText) && filesOrText.length > 0 && !fs.existsSync(filesOrText[0])) {
    convertTexToMarkdown(filesOrText[0])
  } else {
    walk(convertTexToMarkdown, {
      path: filesOrText,
      regex: 'tex'
    })
  }
}

module.exports = action
