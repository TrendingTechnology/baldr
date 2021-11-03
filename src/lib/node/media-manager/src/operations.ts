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
async function normalize (filePaths: string[]): Promise<void> {
  if (filePaths.length === 0) {
    filePaths = [process.cwd()]
  }
  // let presParentDir
  // if (parentPresDir != null && parentPresDir) {
  //   presParentDir = locationIndicator.getPresParentDir(filePaths[0])
  //   if (presParentDir != null) {
  //     log.info(
  //       'Run the normalization task on the parent presentation folder: %s',
  //       presParentDir
  //     )
  //     filePaths = [presParentDir]
  //   }
  // }

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
  await walk(
    {
      async asset (filePath) {
        if (!fs.existsSync(`${filePath}.yml`)) {
          await operations.initializeMetaYaml(filePath)
        } else {
          await operations.normalizeMediaAsset(filePath)
        }
        operations.renameByRef(filePath)
      },
      everyFile (filePath) {
        const extension = getExtension(filePath)?.toLowerCase()
        if (extension != null && ['tex', 'yml', 'txt'].includes(extension)) {
          operations.fixTypography(filePath)
        }
        if (filePath.match(/\.yml$/i) != null) {
          validateYamlOneFile(filePath)
        } else if (filePath.match(/\.svg$/i) != null) {
          operations.removeWidthHeightInSvg(filePath)
        }
      },
      presentation (filePath) {
        operations.normalizePresentationFile(filePath)
      },
      tex (filePath) {
        log.info('\nPatch the titles of the TeX file “%s”', [filePath])
        operations.patchTexTitles(filePath)
      }
    },
    {
      path: filePaths
    }
  )
  log.verbose('Generate presentation automatically on path %s:', [filePaths[0]])
  await operations.generateAutomaticPresentation(filePaths[0])
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
