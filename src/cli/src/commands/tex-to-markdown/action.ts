// Node packages.
import fs from 'fs'

// Third party packages.
import chalk from 'chalk'

// Project packages.
import { convertTexToMd } from '@bldr/tex-markdown-converter'
import { locationIndicator, walk } from '@bldr/media-manager'
import { readFile } from '@bldr/file-reader-writer'
import * as log from '@bldr/log'

/**
 * @param input - A file path or a text string to convert.
 */
function convertTexToMarkdown (input: string): string {
  let content: string
  if (!fs.existsSync(input)) {
    content = input
  } else {
    log.info(chalk.green(locationIndicator.getRelPath(input)))
    content = readFile(input)
  }
  log.info('\n' + chalk.yellow('Original:') + '\n')
  log.info(content)
  content = convertTexToMd(content)
  log.info(chalk.green('Converted:'))
  log.info(content)
  return content
}

/**
 * Convert TeX to markdown.
 *
 * @param {Array} filesOrText - An array of input files, comes from the commanders’
 *   variadic parameter `[files...]` or a text block in the first element
 *   of the array.
 */
async function action (filesOrText: string | string[]): Promise<void> {
  if (Array.isArray(filesOrText) && filesOrText.length > 0 && !fs.existsSync(filesOrText[0])) {
    convertTexToMarkdown(filesOrText[0])
  } else {
    await walk(convertTexToMarkdown, {
      path: filesOrText,
      regex: 'tex'
    })
  }
}

module.exports = action