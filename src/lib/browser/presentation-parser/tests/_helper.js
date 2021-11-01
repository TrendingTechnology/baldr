const path = require('path')

const { readFile } = require('@bldr/file-reader-writer')
const config = require('@bldr/config')

const { parse } = require('../dist/node/main.js')

function parseTestPresentation (fileName) {
  return parse(readFile(path.join(__dirname, 'files', `${fileName}.baldr.yml`)))
}

function parseRealWorldPresentation (relPath) {
  return parse(
    readFile(
      path.join(
        config.mediaServer.basePath,
        'Musik',
        relPath,
        'Praesentation.baldr.yml'
      )
    )
  )
}

module.exports = {
  parseTestPresentation,
  parseRealWorldPresentation
}
