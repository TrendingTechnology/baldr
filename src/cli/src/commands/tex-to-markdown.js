// Node packages.
const path = require('path')
const fs = require('fs')

// Third party packages.
const chalk = require('chalk')

// Project packages.
const mediaServer = require('@bldr/api-media-server')
const lib = require('../lib.js')

const basePaths = new mediaServer.BasePaths()

/**
 * @param {String} input - A file path or a text string to convert.
 */
function convertTexToMarkdown (input) {
  let content
  if (!fs.existsSync(input)) {
    content = input
  } else {
    console.log(chalk.green(basePaths.getRelPath(input)))
    content = lib.readFile(input)
  }

  // Remove TeX header and footer
  content = content.replace(/.*\\begin\{document\}/s, '')
  content = content.replace(/\\end\{document\}.*/s, '')
  // convert \pfeil{}
  content = content.replace(/\\pfeil\{?\}?/g, '->')
  content = content.replace(
    /\\begin\{(compactitem|itemize)\}(.+?)\\end\{(compactitem|itemize)\}/gs,
    function (match, p1, p2) {
      let content = p2
      // \item Lorem -> - Lorem
      content = content.replace(/\\item\s*/g, '- ')
      // No empty lines
      content = content.replace(/\n\n/g, '\n')
      content = content.replace(/\n(\w|-> )/g, '\n  $1')
      console.log(content)
      return content
    }
  )

  content = lib.semanticMarkupTexToHtml(content)
  console.log(content)
  return content
}

/**
 * @param {Array} filesOrText - An array of input files, comes from the commanders’
 *   variadic parameter `[files...]` or a text block in the first element
 *   of the array.
 */
function action (filesOrText) {
  if (Array.isArray(filesOrText) && filesOrText.length > 0 && !fs.existsSync(filesOrText[0])) {
    convertTexToMarkdown(filesOrText[0])
  } else {
    mediaServer.walk(convertTexToMarkdown, {
      path: filesOrText (),
      regex: 'tex'
    })
  }
}

module.exports = action
