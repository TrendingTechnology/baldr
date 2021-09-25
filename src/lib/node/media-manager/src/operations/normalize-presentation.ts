import { LampTypes } from '@bldr/type-definitions'
import { readFile, writeFile, readYamlFile } from '@bldr/file-reader-writer'
import { genUuid } from '@bldr/core-browser'
import { convertToYaml } from '@bldr/yaml'
import { DeepTitle } from '@bldr/titles'
import * as log from '@bldr/log'

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
function shortedMediaUris (
  rawYamlString: string,
  presentationId: string
): string {
  return rawYamlString.replace(
    new RegExp(`ref:${presentationId}_`, 'g'),
    'ref:./'
  )
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
  const oldTextContent = textContent
  const presentation = readYamlFile(filePath) as LampTypes.FileFormat

  // Generate meta.
  const title = new DeepTitle(filePath)
  const meta = title.generatePresetationMeta()

  if (presentation?.meta?.ref != null) {
    meta.ref = presentation.meta.ref
  }
  if (presentation?.meta?.curriculumUrl != null) {
    meta.curriculumUrl = presentation.meta.curriculumUrl
  }
  if (presentation?.meta?.uuid == null) {
    meta.uuid = genUuid()
  } else {
    meta.uuid = presentation.meta.uuid
  }

  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  const metaSorted: LampTypes.PresentationMeta = {} as LampTypes.PresentationMeta

  metaSorted.ref = meta.ref
  if (meta.uuid != null) {
    metaSorted.uuid = meta.uuid
  }
  metaSorted.title = meta.title
  metaSorted.subtitle = meta.subtitle
  metaSorted.grade = meta.grade
  metaSorted.curriculum = meta.curriculum
  if (meta.curriculumUrl != null) {
    metaSorted.curriculumUrl = meta.curriculumUrl
  }

  const metaString = convertToYaml({ meta: metaSorted })
  textContent = textContent.replace(
    /.*\nslides:/s,
    metaString + comment + '\nslides:'
  )

  // Shorten media URIs with `./`
  if (meta.ref != null) {
    textContent = shortedMediaUris(textContent, meta.ref)
  }

  textContent = removeSingleQuotes(textContent)

  // Remove single quotes.
  if (oldTextContent !== textContent) {
    log.info('Normalized presentation %s', filePath)
    log.verbose(log.colorizeDiff(oldTextContent, textContent))
    writeFile(filePath, textContent)
  } else {
    log.info('No changes after normalization of the presentation %s', filePath)
  }
}
