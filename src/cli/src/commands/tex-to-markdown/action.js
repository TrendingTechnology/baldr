// Node packages.
const path = require('path')
const fs = require('fs')

// Third party packages.
const chalk = require('chalk')

// Project packages.
const mediaServer = require('@bldr/api-media-server')
const { convertTexToMd } = require('@bldr/core-browser')

const lib = require('../../lib.js')

const locationIndicator = new mediaServer.LocationIndicator()

/**
 * @param {String} input - A file path or a text string to convert.
 */
function convertTexToMarkdown (input) {
  let content
  if (!fs.existsSync(input)) {
    content = input
  } else {
    console.log(chalk.green(locationIndicator.getRelPath(input)))
    content = lib.readFile(input)
  }
  console.log('\n' + chalk.yellow('Original:') + '\n')
  console.log(content)
  content = convertTexToMd(content)
  console.log(chalk.green('Converted:'))
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
      path: filesOrText,
      regex: 'tex'
    })
  }
}

module.exports = action
