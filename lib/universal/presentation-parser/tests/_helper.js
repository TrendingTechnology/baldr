import path from 'path'

import { readFile } from '@bldr/file-reader-writer'
import { getConfig } from '@bldr/config'

import { parse } from '../dist/main'

const config = getConfig()

/**
 * Parse a real word example with a set path.
 *
 * @param {string} relPath
 *
 * @returns A presentation with a set path attribute im meta.path
 */
export function parseRealWorldPresentation (relPath) {
  const relPathInMedia = path.join('Musik', relPath, 'Praesentation.baldr.yml')
  const presentation = parse(
    readFile(path.join(config.mediaServer.basePath, relPathInMedia))
  )
  presentation.meta.path = relPathInMedia

  return presentation
}

export function parsePresentation (relPath) {
  return parse(readFile(path.join(new URL('.', import.meta.url).pathname, 'files', `${relPath}.baldr.yml`)))
}

export function parseFirstSlide (relPath) {
  const presentation = parsePresentation(relPath)
  return presentation.getSlideByNo(1)
}
