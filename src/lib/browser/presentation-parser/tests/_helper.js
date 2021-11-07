const path = require('path')

const { readFile } = require('@bldr/file-reader-writer')
const { parse } = require('../dist/node/main.js')
const { getConfig } = require('@bldr/config-ng')

const config = getConfig()

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

function parsePresentation (relPath) {
  return parse(
    readFile(path.join(__dirname, 'files', `${relPath}.baldr.yml`))
  )
}

function parseFirstSlide (relPath) {
  const presentation = parsePresentation(relPath)
  return presentation.getSlideByNo(1)
}

module.exports = {
  parseRealWorldPresentation,
  parsePresentation,
  parseFirstSlide
}
