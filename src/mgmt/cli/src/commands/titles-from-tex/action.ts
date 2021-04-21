// Node packages.
import path from 'path'
import fs from 'fs'

// Third party packages.
import chalk from 'chalk'

// Project packages.
import { convertTexToMd } from '@bldr/tex-markdown-converter'
import { walk } from '@bldr/media-manager'
import { readFile, writeFile } from '@bldr/core-node'

function clean (text: string): string {
  text = text.replace(/\n/g, ' ')
  text = text.replace(/\s+/g, ' ')
  text = convertTexToMd(text)
  return text
}

function convertTexToFolderTitles (filePath: string, cmdObj: any): void {
  const content = readFile(filePath)
  const matchTitle = content.match(/ {2}titel = \{(.+?)\}[,\n]/s)
  const output = []
  let title: string = ''
  let subtitle: string = ''

  if (matchTitle) {
    title = clean(matchTitle[1])
    output.push(title)
  }

  const matchSubtitle = content.match(/ {2}untertitel = \{(.+?)\}[,\n]/s)
  if (matchSubtitle) {
    subtitle = clean(matchSubtitle[1])
    output.push(subtitle)
  }

  if (output.length > 0) {
    const destBasePath = path.resolve(path.dirname(filePath), '..')
    let dest: string
    const destFinal = path.join(destBasePath, 'title.txt')
    if (!fs.existsSync(destFinal) || cmdObj.force) {
      dest = destFinal
    } else {
      dest = path.join(destBasePath, 'title_tmp.txt')
    }
    const presFile = path.join(destBasePath, 'Praesentation.baldr.yml')
    if (!fs.existsSync(presFile) || cmdObj.force) {
      writeFile(presFile, '---\n')
    }
    console.log(chalk.green(dest))
    console.log(`  title: ${chalk.blue(title)}`)
    console.log(`  subtitle: ${chalk.cyan(subtitle)}\n`)
    writeFile(dest, output.join('\n') + '\n')
  }
}

/**
 * Create from the TeX files the folder titles text file `title.txt`.
 *
 * @param filePaths - An array of input files. This parameter comes from
 *   the commanders’ variadic parameter `[files...]`.
 * @param cmdObj - An object containing options as key-value pairs.
 *  This parameter comes from `commander.Command.opts()`
 */
function action (filePaths: string[], cmdObj: { [key: string]: any }) {
  walk(convertTexToFolderTitles, {
    path: filePaths,
    regex: 'tex',
    payload: cmdObj
  })
}

module.exports = action
