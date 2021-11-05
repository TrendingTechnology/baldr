/**
 * Bundle all operations in an object
 */
import fs from 'fs'

import { convertFromYamlRaw } from '@bldr/yaml'
import { GenericError } from '@bldr/type-definitions'
import { getExtension } from '@bldr/core-browser'
import * as log from '@bldr/log'

import { walk } from './directory-tree-walk'
import { generateCloze, patchTexTitles } from './tex'
import {
  normalizePresentationFile,
  generateAutomaticPresentation
} from './presentation'
import { removeWidthHeightInSvg, fixTypography } from './txt'
import {
  renameMediaAsset,
  moveAsset,
  renameByRef,
  normalizeMediaAsset,
  initializeMetaYaml,
  convertAsset
} from './asset'

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

/**
 * Execute different normalization tasks.
 *
 * @param filePaths - An array of input files, comes from the
 *   commanders’ variadic parameter `[files...]`.
 */
async function normalize (
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

  async function normalizeAsset (filePath: string): Promise<void> {
    const yamlFile = `${filePath}.yml`
    if (yamlFile) {
      await operations.initializeMetaYaml(filePath)
    } else {
      await operations.normalizeMediaAsset(filePath)
    }
    operations.renameByRef(filePath)
    operations.fixTypography(yamlFile)
  }

  function normalizeEveryFile (filePath: string): void {
    const extension = getExtension(filePath)?.toLowerCase()
    if (extension != null && extension === 'txt') {
      operations.fixTypography(filePath)
    }
    if (filePath.match(/\.yml$/i) != null) {
      validateYamlOneFile(filePath)
    } else if (filePath.match(/\.svg$/i) != null) {
      operations.removeWidthHeightInSvg(filePath)
    }
  }

  async function normalizePresentation (filePath: string): Promise<void> {
    operations.normalizePresentationFile(filePath)
    log.verbose('Generate presentation automatically on path %s:', [filePath])
    await operations.generateAutomaticPresentation(filePath)
    operations.fixTypography(filePath)
  }

  function normalizeTex (filePath: string): void {
    log.info('\nPatch the titles of the TeX file “%s”', [filePath])
    operations.patchTexTitles(filePath)
    operations.fixTypography(filePath)
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

/**
 * A collection of functions to manipulate the media assets and presentation files.
 */
export const operations = {
  convertAsset,
  fixTypography,
  generateCloze,
  generateAutomaticPresentation,
  initializeMetaYaml,
  normalize,
  moveAsset,
  normalizeMediaAsset,
  normalizePresentationFile,
  patchTexTitles,
  removeWidthHeightInSvg,
  renameByRef,
  renameMediaAsset
}
