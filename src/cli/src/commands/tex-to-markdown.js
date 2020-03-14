// Node packages.
const path = require('path')

// Third party packages.
const chalk = require('chalk')

// Project packages.
const mediaServer = require('@bldr/api-media-server')
const lib = require('../lib.js')

const basePaths = new mediaServer.BasePaths()

function convertTexToMarkdown (filePath) {
  console.log(chalk.green(basePaths.getRelPath(filePath)))
  let content = lib.readFile(filePath)

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
}

/**
 * @param {Array} files - An array of input files, comes from the commanders’
 *   variadic parameter `[files...]`.
 */
function action (files) {
  mediaServer.walk(convertTexToMarkdown, {
    path: files,
    regex: 'tex'
  })
}

module.exports = action
