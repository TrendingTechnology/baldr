// Node packages.
const path = require('path')

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
  console.log(filePath)
  const content = lib.readFile(filePath)
  const title = content.match(/  titel = \{(.+?)\}[,\n]/s)
  const output = []
  if (title) {
    output.push(clean(title[1]))
  }

  const untertitel = content.match(/  untertitel = \{(.+?)\}[,\n]/s)
  if (untertitel) {
    output.push(clean(untertitel[1]))
  }
  console.log(output)
  if (output.length > 0) {
    lib.writeFile(path.join(path.dirname(filePath), 'title_tmp.txt'), output.join('\n') + '\n')
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
