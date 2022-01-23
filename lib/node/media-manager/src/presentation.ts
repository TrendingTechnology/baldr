import fs from 'fs'
import path from 'path'

// Project packages.
import {
  objectifyTexItemize,
  objectifyTexZitat
} from '@bldr/tex-markdown-converter'
import { convertFromYaml, convertToYaml } from '@bldr/yaml'
import { LampTypes } from '@bldr/type-definitions'
import { readFile, writeFile, readYamlFile } from '@bldr/file-reader-writer'
import { generateUuid } from '@bldr/uuid'
import { DeepTitle } from '@bldr/titles'
import * as log from '@bldr/log'
import { buildDbAssetData } from '@bldr/media-data-collector'

import { walk } from './directory-tree-walk'
import { locationIndicator } from './location-indicator'
import { logFileDiff } from './asset'

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
export function normalizePresentationFile (
  filePath: string,
  oldTextContent?: string
): void {
  let textContent = readFile(filePath)
  const intermediateTextContent = textContent
  if (oldTextContent == null) {
    oldTextContent = textContent
  }
  const oldPresentation = convertFromYaml(
    oldTextContent
  ) as LampTypes.FileFormat

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
  if (oldPresentation.meta?.uuid != null) {
    meta.uuid = oldPresentation.meta.uuid
  } else if (presentation?.meta?.uuid == null) {
    meta.uuid = generateUuid()
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
  metaSorted.subject = meta.subject
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
  if (intermediateTextContent !== textContent) {
    if (oldTextContent !== textContent) {
      logFileDiff(filePath, oldTextContent, textContent)
    }
    writeFile(filePath, textContent)
  } else {
    log.verbose('No changes after normalization of the presentation %s', [
      filePath
    ])
  }
}

interface SlideData {
  [key: string]: any
}

function slidify (
  masterName: string,
  data: SlideData[] | SlideData,
  topLevelData: SlideData
): SlideData[] {
  function slidifySingle (masterName: string, data: SlideData): SlideData {
    const slide: SlideData = {}
    slide[masterName] = data
    if (topLevelData != null) Object.assign(slide, topLevelData)
    return slide
  }

  if (Array.isArray(data)) {
    const result = []
    for (const item of data) {
      result.push(slidifySingle(masterName, item))
    }
    return result
  } else {
    return [slidifySingle(masterName, data)]
  }
}

/**
 * Create a presentation file and insert all media assets in
 * the presentation.
 *
 * @param filePath - The file path of the new created presentation
 *   template.
 */
async function generatePresentation (filePath: string): Promise<void> {
  const basePath = path.dirname(filePath)
  let slides: SlideData[] = []
  await walk(
    {
      asset (relPath) {
        let asset
        if (fs.existsSync(`${relPath}.yml`)) {
          asset = buildDbAssetData(relPath)
        }

        if (asset == null || asset.ref == null) {
          return
        }
        let masterName: string = 'generic'
        if (asset.ref.includes('_LT')) {
          masterName = 'cloze'
        } else if (asset.ref.includes('NB')) {
          masterName = 'score_sample'
        } else if (asset.mimeType != null) {
          masterName = asset.mimeType
        }
        const slideData: SlideData = {
          [masterName]: `ref:${asset.ref}`
        }
        slides.push(slideData)
      }
    },
    { path: basePath, maxDepths: 1 }
  )

  const notePath = path.join(basePath, 'Hefteintrag.tex')
  if (fs.existsSync(notePath)) {
    const noteContent = readFile(notePath)
    slides = slides.concat(
      slidify('note', objectifyTexItemize(noteContent), {
        source: 'Hefteintrag.tex'
      })
    )
  }

  const worksheetPath = path.join(basePath, 'Arbeitsblatt.tex')
  if (fs.existsSync(worksheetPath)) {
    const worksheetContent = readFile(worksheetPath)
    slides = slides.concat(
      slidify('quote', objectifyTexZitat(worksheetContent), {
        source: 'Arbeitsblatt.tex'
      })
    )
  }

  log.verbose('Write automatically generated presentation file to path %s', [
    filePath
  ])
  const result = convertToYaml({
    slides
  })
  log.debug(result)
  writeFile(filePath, result)
}

/**
 * Create a automatically generated presentation file.
 */
export async function generateAutomaticPresentation (
  filePath?: string,
  force?: boolean
): Promise<void> {
  if (filePath == null) {
    filePath = process.cwd()
  } else {
    const stat = fs.statSync(filePath)
    if (!stat.isDirectory()) {
      filePath = path.dirname(filePath)
    }
  }
  filePath = locationIndicator.getTwoDigitPrefixedParentDir(filePath)

  if (filePath == null) {
    log.warn('You are not in a presentation folder prefixed with two digits!')
    return
  }

  filePath = path.resolve(path.join(filePath, 'Praesentation.baldr.yml'))
  if (!fs.existsSync(filePath) || (force != null && force)) {
    log.info('Presentation template created at: %s', [filePath])
  } else {
    const rawPresentation = readYamlFile(filePath)
    log.verboseAny(rawPresentation)
    if (rawPresentation?.slides != null) {
      filePath = filePath.replace('.baldr.yml', '_automatic.baldr.yml')
      log.verbose('Presentation already exists, create tmp file: %s', [
        log.colorize.red(filePath)
      ])
    } else {
      log.info('Overwrite the presentation as it has no slides: %s', [
        log.colorize.red(filePath)
      ])
    }
  }

  let oldTextContent: string | undefined
  if (fs.existsSync(filePath)) {
    oldTextContent = readFile(filePath)
  }

  await generatePresentation(filePath)
  normalizePresentationFile(filePath, oldTextContent)
}
