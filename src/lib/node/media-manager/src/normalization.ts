/**
 * Bundle all operations in an object
 */
import fs from 'fs'

import { convertFromYamlRaw } from '@bldr/yaml'
import { GenericError } from '@bldr/type-definitions'
import { getExtension } from '@bldr/core-browser'
import * as log from '@bldr/log'
import { parseAndResolve } from '@bldr/presentation-parser'
import { readFile } from '@bldr/file-reader-writer'
import { updateMediaServer } from '@bldr/api-wrapper'

import { walk } from './directory-tree-walk'
import { patchTexTitles } from './tex'
import * as presentationOperations from './presentation'
import * as txtOperations from './txt'
import * as assetOperations from './asset'

/**
 * Indicates if the media server was updated in the current run of the program.
 */
let mediaServerUpdated: boolean = false

function validateYamlOneFile (filePath: string): void {
  try {
    convertFromYamlRaw(fs.readFileSync(filePath, 'utf8'))
    log.debug('Valid YAML file: %s', [filePath])
  } catch (error) {
    const e = error as GenericError
    log.error('Invalid YAML file %s. Error: %s: %s', [
      filePath,
      e.name,
      e.message
    ])
    throw new Error(e.name)
  }
}

async function normalizeAsset (filePath: string): Promise<void> {
  const yamlFile = `${filePath}.yml`
  if (!fs.existsSync(yamlFile)) {
    await assetOperations.initializeMetaYaml(filePath)
  } else {
    await assetOperations.normalizeMediaAsset(filePath)
  }
  assetOperations.renameByRef(filePath)
  txtOperations.fixTypography(yamlFile)
}

function normalizeEveryFile (filePath: string): void {
  const extension = getExtension(filePath)?.toLowerCase()
  if (extension != null && extension === 'txt') {
    txtOperations.fixTypography(filePath)
  }
  if (filePath.match(/\.yml$/i) != null) {
    validateYamlOneFile(filePath)
  } else if (filePath.match(/\.svg$/i) != null) {
    txtOperations.removeWidthHeightInSvg(filePath)
  }
}

async function normalizePresentation (filePath: string): Promise<void> {
  presentationOperations.normalizePresentationFile(filePath)
  log.verbose('Generate presentation automatically on path %s:', [filePath])
  await presentationOperations.generateAutomaticPresentation(filePath)
  txtOperations.fixTypography(filePath)
  if (!mediaServerUpdated) {
    await updateMediaServer()
    mediaServerUpdated = true
  }
  const presentation = await parseAndResolve(readFile(filePath))
  presentation.log()
}

function normalizeTex (filePath: string): void {
  log.info('\nPatch the titles of the TeX file “%s”', [filePath])
  patchTexTitles(filePath)
  txtOperations.fixTypography(filePath)
}

/**
 * Execute different normalization tasks.
 *
 * @param filePaths - An array of input files, comes from the
 *   commanders’ variadic parameter `[files...]`.
 */
export async function normalize (
  filePaths: string[],
  filter?: 'presentation' | 'tex' | 'asset'
): Promise<void> {
  if (filePaths.length === 0) {
    filePaths = [process.cwd()]
  }
  // `baldr normalize video.mp4.yml` only validates the YAML structure. We have
  // to call `baldr normalize video.mp4` to get the full normalization of the
  // metadata file video.mp4.yml.
  if (
    filePaths.length === 1 &&
    filePaths[0].match(/\.yml$/) != null &&
    filePaths[0].match(/\.baldr\.yml$/) == null
  ) {
    filePaths[0] = filePaths[0].replace(/\.yml$/, '')
  }

  let functionBundle = {}

  if (filter == null) {
    functionBundle = {
      asset: normalizeAsset,
      everyFile: normalizeEveryFile,
      presentation: normalizePresentation,
      tex: normalizeTex
    }
  } else if (filter === 'presentation') {
    log.info('Normalize only presentations')
    functionBundle = {
      presentation: normalizePresentation
    }
  } else if (filter === 'tex') {
    log.info('Normalize only TeX files')

    functionBundle = {
      tex: normalizeTex
    }
  } else if (filter === 'asset') {
    log.info('Normalize only assets')
    functionBundle = {
      asset: normalizeAsset
    }
  }

  await walk(functionBundle, {
    path: filePaths
  })
  
}
