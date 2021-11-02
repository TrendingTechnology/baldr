const path = require('path')

const { readFile } = require('@bldr/file-reader-writer')
const config = require('@bldr/config')

const { parse } = require('../dist/node/main.js')

function parseMasterPresentation (masterName) {
  return parse(
    readFile(path.join(__dirname, 'files', 'masters', `${masterName}.baldr.yml`))
  )
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

function parseTestPresentation (fileName) {
  return parse(
    readFile(path.join(__dirname, 'files', `${fileName}.baldr.yml`))
  )
}

module.exports = {
  parseMasterPresentation,
  parseRealWorldPresentation,
  parseTestPresentation
}
