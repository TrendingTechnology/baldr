const path = require('path')

const { readFile } = require('@bldr/file-reader-writer')
const { parse } = require('../dist/node/main.js')
const { getConfig } = require('@bldr/config')

const config = getConfig()

/**
 * Parse a real word example with a set path.
 *
 * @param {string} relPath
 *
 * @returns A presentation with a set path attribute im meta.path
 */
function parseRealWorldPresentation (relPath) {
  const relPathInMedia = path.join('Musik', relPath, 'Praesentation.baldr.yml')
  const presentation = parse(
    readFile(path.join(config.mediaServer.basePath, relPathInMedia))
  )
  presentation.meta.path = relPathInMedia

  return presentation
}

function parsePresentation (relPath) {
  return parse(readFile(path.join(__dirname, 'files', `${relPath}.baldr.yml`)))
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
