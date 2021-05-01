import type { PresentationTypes } from '@bldr/type-definitions'
import { readFile, writeFile } from '@bldr/core-node'
import { genUuid } from '@bldr/core-browser'
import { convertToYaml } from '@bldr/yaml'
import { DeepTitle } from '@bldr/titles'

import { loadYaml } from '../yaml'

const comment = `
#-----------------------------------------------------------------------
#
#-----------------------------------------------------------------------
`

/**
 * Remove unnecessary single quotes.
 *
 * js-yaml add single quotes arround the media URIs, for example
 * `'ref:fuer-elise'`.
 *
 * @param rawYamlString - A raw YAML string (not converted into a
 *   Javascript object).
 *
 * @returns A raw YAML string without single quotes around the media
 *   URIs.
 */
function removeSingleQuotes (rawYamlString: string): string {
  return rawYamlString.replace(/ 'ref:([^']*)'/g, ' ref:$1')
}

/**
 * Shorten all media URIs in a presentation file.
 *
 * The presentation is not converted into YAML. This function operates
 * by replacing text substrings.
 *
 * @param rawYamlString - A raw YAML string (not converted into a
 *   Javascript object).
 * @param presentationId - The ID of a presentation.
 *
 * @returns A raw YAML string without single quotes around the media
 *   URIs.
 */
function shortedMediaUris (rawYamlString: string, presentationId: string): string {
  return rawYamlString.replace(new RegExp(`ref:${presentationId}_`, 'g'), 'ref:./')
}

/**
 * Normalize a presentation file.
 *
 * Remove unnecessary single quotes around media URIs.
 *
 * @param filePath - A path of a text file.
 */
export function normalizePresentationFile (filePath: string): void {
  let textContent = readFile(filePath)
  const presentation = loadYaml(filePath) as PresentationTypes.FileFormat

  // Generate meta.
  const title = new DeepTitle(filePath)
  const meta = title.generatePresetationMeta()

  if (presentation.meta?.ref != null) {
    meta.ref = presentation.meta.ref
  }
  if (presentation.meta?.curriculumUrl != null) {
    meta.curriculumUrl = presentation.meta.curriculumUrl
  }
  if (presentation.meta?.uuid != null) {
    meta.uuid = genUuid()
  }

  const metaString = convertToYaml({ meta })
  textContent = textContent.replace(/.*\nslides:/s, metaString + comment + '\nslides:')

  // Shorten media URIs with `./`
  if (meta.ref != null) {
    textContent = shortedMediaUris(textContent, meta.ref)
  }

  // Remove single quotes.
  textContent = removeSingleQuotes(textContent)
  writeFile(filePath, textContent)

  console.log(textContent)
}
