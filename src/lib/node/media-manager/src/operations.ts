/**
 * Bundle all operations in an object
 */

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
import { normalize } from './normalization'

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
