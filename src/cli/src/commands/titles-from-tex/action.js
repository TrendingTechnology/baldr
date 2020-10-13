// Node packages.
const path = require('path')
const fs = require('fs')

// Third party packages.
const chalk = require('chalk')

// Project packages.
const mediaServer = require('@bldr/media-server')
const { convertTexToMd } = require('@bldr/tex-markdown-converter')
const { readFile, writeFile } = require('@bldr/media-manager')

function clean (text) {
  text = text.replace(/\n/g, ' ')
  text = text.replace(/\s+/g, ' ')
  text = convertTexToMd(text)
  return text
}

function convertTexToFolderTitles (filePath, cmdObj) {
  const content = readFile(filePath)
  let title = content.match(/ {2}titel = \{(.+?)\}[,\n]/s)
  const output = []
  if (title) {
    title = clean(title[1])
    output.push(title)
  }

  let subtitle = content.match(/ {2}untertitel = \{(.+?)\}[,\n]/s)
  if (subtitle) {
    subtitle = clean(subtitle[1])
    output.push(subtitle)
  }

  if (output.length > 0) {
    const destBasePath = path.resolve(path.dirname(filePath), '..')
    let dest
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
 * @param {Array} files - An array of input files, comes from the commanders’
 *   variadic parameter `[files...]`.
 */
function action (files, cmdObj) {
  mediaServer.walk(convertTexToFolderTitles, {
    path: files,
    regex: 'tex',
    payload: cmdObj
  })
}

module.exports = action
