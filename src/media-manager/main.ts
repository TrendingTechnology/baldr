/**
 * Manage the media files in the media server directory (create,
 * normalize metadata files, rename media files, normalize the
 * presentation content file).
 *
 * @module @bldr/media-manager
 */

import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'
import fetch from 'node-fetch'
import { URL } from 'url'
import { getExtension, convertPropertiesCamelToSnake, convertPropertiesSnakeToCamel, jsYamlConfig } from '@bldr/core-browser-ts'

import { DeepTitle, TitleTree } from './titles'

import { PresentationFileFormat } from '@bldr/type-defintions'

interface MediaAsset {
  cover_source: string
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
export function readFile(filePath: string): string {
  return fs.readFileSync(filePath, { encoding: 'utf-8' })
}

/**
 * Write some text content into a file.
 *
 * @param filePath - A path of a text file.
 * @param content - Some text to write to a file.
 */
export function writeFile(filePath: string, content: string) {
  fs.writeFileSync(filePath, content)
}

/**
 * Convert a Javascript object into a text string, ready to be written
 * into a text file. The property names are converted to `snake_case`.
 *
 * @param data - Some data to convert to YAML.
 *
 * @returns A string in the YAML format ready to be written into a text
 *   file. The result string begins with `---`.
 */
export function yamlToTxt (data: any): string {
  data = convertPropertiesCamelToSnake(data)
  const yamlMarkup = [
    '---',
    yaml.safeDump(data, jsYamlConfig)
  ]
  return yamlMarkup.join('\n')
}

interface MoveAssetConfiguration {
  copy: boolean
  dryRun: boolean
}

/**
 * Move (rename) or copy a media asset and it’s corresponding meta data file
 * (`*.yml`) and preview file (`_preview.jpg`).
 *
 * @param oldPath - The old path of a media asset.
 * @param newPath - The new path of a media asset.
 * @param opts - Some options
 */
export function moveAsset (oldPath: string, newPath: string, opts: MoveAssetConfiguration = <MoveAssetConfiguration> {}) {
  function move (oldPath: string, newPath: string, { copy, dryRun }: MoveAssetConfiguration) {
    if (copy) {
      if (!dryRun) fs.copyFileSync(oldPath, newPath)
    } else {
      if (!dryRun) {
        //  Error: EXDEV: cross-device link not permitted,
        try {
          fs.renameSync(oldPath, newPath)
        } catch (error) {
          if (error.code === 'EXDEV') {
            fs.copyFileSync(oldPath, newPath)
            fs.unlinkSync(oldPath)
          }
        }
      }
    }
  }

  function moveCorrespondingFile (oldPath: string, newPath: string, search: RegExp, replace: string, opts: MoveAssetConfiguration) {
    oldPath = oldPath.replace(search, replace)
    if (fs.existsSync(oldPath)) {
      newPath = newPath.replace(search, replace)
      move(oldPath, newPath, opts)
    }
  }

  if (newPath && oldPath !== newPath) {
    if (!opts.dryRun) fs.mkdirSync(path.dirname(newPath), { recursive: true })

    const extension = getExtension(oldPath)
    if (extension === 'eps') {
      // Dippermouth-Blues.eps
      // Dippermouth-Blues.mscx
      moveCorrespondingFile(oldPath, newPath, /\.eps$/, '.mscx', opts)
      // Dippermouth-Blues-eps-converted-to.pdf
      moveCorrespondingFile(oldPath, newPath, /\.eps$/, '-eps-converted-to.pdf', opts)
    }

    // Beethoven.mp4 Beethoven.mp4.yml Beethoven.mp4_preview.jpg
    for (const suffix of ['.yml', '_preview.jpg']) {
      if (fs.existsSync(`${oldPath}${suffix}`)) {
        move(`${oldPath}${suffix}`, `${newPath}${suffix}`, opts)
      }
    }
    move(oldPath, newPath, opts)
    return newPath
  }
}

/**
 * Download a URL to a destination.
 *
 * @param url - The URL.
 * @param dest - The destination. Missing parent directories are
 *   automatically created.
 */
export async function fetchFile (url: string, dest: string) {
  const response = await fetch(new URL(url))
  fs.mkdirSync(path.dirname(dest), { recursive: true })
  fs.writeFileSync(dest, Buffer.from(await response.arrayBuffer()))
}

/**
 * Load a YAML file. Return only objects to save vscode type checks.
 *
 * @param filePath - The path of a YAML file.
 *
 * @returns The parsed YAML file as a object. The string properties are
 * in the camleCase format.
 */
export function loadYaml (filePath: string): PresentationFileFormat | MediaAsset | object {
  const result = yaml.safeLoad(readFile(filePath))
  if (typeof result !== 'object') {
    return { result }
  }
  return convertPropertiesSnakeToCamel(result)
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
  const presentation = <PresentationFileFormat> loadYaml(filePath)

  // Generate meta.
  const title = new DeepTitle(filePath)
  const meta = title.generatePresetationMeta()
  if (presentation.meta) {
    if (presentation.meta.id) meta.id = presentation.meta.id
    if (presentation.meta.curriculumUrl) meta.curriculumUrl = presentation.meta.curriculumUrl
  }
  const metaString = yamlToTxt({ meta })
  textContent = textContent.replace(/.*\n?slides:/s, metaString + '\nslides:')

  // Shorten media URIs with `./`
  if (meta.id) {
    textContent = shortedMediaUris(textContent, meta.id)
  }

  // Remove single quotes.
  textContent = removeSingleQuotes(textContent)
  writeFile(filePath, textContent)

  console.log(textContent)
}

export default {
  DeepTitle,
  TitleTree
}
