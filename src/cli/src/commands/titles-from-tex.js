// Node packages.
const path = require('path')
const fs = require('fs')

// Third party packages.
const chalk = require('chalk')

// Project packages.
const mediaServer = require('@bldr/api-media-server')
const lib = require('../lib.js')

function clean (text) {
  text = text.replace(/\n/g, ' ')
  text = text.replace(/\s+/g, ' ')
  text = lib.semanticMarkupTexToHtml(text)
  return text
}

function convertTexToFolderTitles (filePath) {
  const content = lib.readFile(filePath)
  let title = content.match(/  titel = \{(.+?)\}[,\n]/s)
  const output = []
  if (title) {
    title = clean(title[1])
    output.push(title)
  }

  let subtitle = content.match(/  untertitel = \{(.+?)\}[,\n]/s)
  if (subtitle) {
    subtitle = clean(subtitle[1])
    output.push(subtitle)
  }
  //console.log(output)
  if (output.length > 0) {
    const destBasePath = path.dirname(filePath)
    let dest
    const destFinal = path.join(destBasePath, 'title.txt')
    if (!fs.existsSync(destFinal)) {
      dest = destFinal
    } else {
      dest = path.join(destBasePath, 'title_tmp.txt')
    }
    console.log(chalk.green(dest))
    console.log(`  title: ${chalk.blue(title)}`)
    console.log(`  subtitle: ${chalk.cyan(subtitle)}\n`)
    lib.writeFile(dest, output.join('\n') + '\n')
  }
}

/**
 * @param {Array} files - An array of input files, comes from the commanders’
 *   variadic parameter `[files...]`.
 */
function action (files) {
  mediaServer.walk(convertTexToFolderTitles, {
    path: files,
    regex: 'tex'
  })
}

module.exports = action
