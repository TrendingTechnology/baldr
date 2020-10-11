/**
 * Manage the media files in the media server directory (create,
 * normalize metadata files, rename media files, normalize the
 * presentation content file).
 *
 * @module @bldr/media-manager
 */

import fs from 'fs'
import yaml from 'js-yaml'

interface Meta {
  curriculumUrl: string
  id: string
  title: string
  subtitle: string
  curriculum: string
  grade: number
}

interface Presentation {
  meta: Meta
}

/**
 * Read the content of a text file in the `utf-8` format.
 *
 * A wrapper around `fs.readFileSync()`
 *
 * @param filePath - A path of a text file.
 *
 * @returns The content of the file in the `utf-8` format.
 */
function readFile(filePath: string): string {
  return fs.readFileSync(filePath, { encoding: 'utf-8' })
}

/**
 * Write some text content into a file.
 *
 * @param filePath - A path of a text file.
 * @param content - Some text to write to a file.
 */
function writeFile(filePath: string, content: string) {
  fs.writeFileSync(filePath, content)
}

/**
 * Load a YAML file. Return only objects to save vscode type checks.
 *
 * @param filePath - The path of a YAML file.
 *
 * @returns The parse YAML file as a object.
 */
function loadYaml (filePath: string): Presentation | object {
  const result = yaml.safeLoad(readFile(filePath))
  if (typeof result !== 'object') {
    return { result }
  }
  return result
}

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
  const presentation = <Presentation> loadYaml(filePath)
  if (presentation.meta && presentation.meta.id) {
    textContent = shortedMediaUris(textContent, presentation.meta.id)
  }
  textContent = removeSingleQuotes(textContent)
  writeFile(filePath, textContent)
}
