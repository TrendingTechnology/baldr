const path = require('path')

const { readFile } = require('@bldr/file-reader-writer')
const { parse } = require('../dist/node/main.js')
const { getConfig } = require('@bldr/config-ng')

const config = getConfig()

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

function parseFirstSlide (relPath) {
  const presentation = parseTestPresentation(relPath)
  return presentation.getSlideByNo(1)
}

module.exports = {
  parseMasterPresentation,
  parseRealWorldPresentation,
  parseTestPresentation,
  parseFirstSlide
}
