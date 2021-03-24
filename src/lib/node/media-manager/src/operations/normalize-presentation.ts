import { PresentationTypes } from '@bldr/type-definitions'
import { readFile, writeFile } from '@bldr/core-node'
import { convertToYaml } from '@bldr/yaml'

import { DeepTitle } from '../titles'
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
 * `'id:fuer-elise'`.
 *
 * @param rawYamlString - A raw YAML string (not converted into a
 *   Javascript object).
 *
 * @returns A raw YAML string without single quotes around the media
 *   URIs.
 */
function removeSingleQuotes(rawYamlString: string): string {
  return rawYamlString.replace(/ 'id:([^']*)'/g, ' id:$1')
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
function shortedMediaUris(rawYamlString: string, presentationId: string): string {
  return rawYamlString.replace(new RegExp(`id:${presentationId}_`, 'g'), 'id:./')
}

/**
 * Normalize a presentation file.
 *
 * Remove unnecessary single quotes around media URIs.
 *
 * @param filePath - A path of a text file.
 */
export function normalizePresentationFile(filePath: string) {
  let textContent = readFile(filePath)
  const presentation = <PresentationTypes.FileFormat> loadYaml(filePath)

  // Generate meta.
  const title = new DeepTitle(filePath)
  const meta = title.generatePresetationMeta()
  if (presentation.meta) {
    if (presentation.meta.id) meta.id = presentation.meta.id
    if (presentation.meta.curriculumUrl) meta.curriculumUrl = presentation.meta.curriculumUrl
  }
  const metaString = convertToYaml({ meta })
  textContent = textContent.replace(/.*\nslides:/s, metaString + comment + '\nslides:')

  // Shorten media URIs with `./`
  if (meta.id) {
    textContent = shortedMediaUris(textContent, meta.id)
  }

  // Remove single quotes.
  textContent = removeSingleQuotes(textContent)
  writeFile(filePath, textContent)

  console.log(textContent)
}
