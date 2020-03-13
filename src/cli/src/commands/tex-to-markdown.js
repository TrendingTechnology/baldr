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

function convertTexToMarkdown (filePath) {
  console.log(filePath)
  let content = lib.readFile(filePath)

  content = content.replace(/.*\\begin\{document\}/s, '')
  content = content.replace(/\\end\{document\}.*/s, '')
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

  // if (output.length > 0) {
  //   lib.writeFile(path.join(path.dirname(filePath), 'title_tmp.txt'), output.join('\n') + '\n')
  // }
  //console.log(content)
}

function action (filePath) {
  mediaServer.walkDeluxeSync(convertTexToMarkdown, 'tex', filePath)
}

module.exports = action
