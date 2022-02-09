/**
 * Bundle all operations in an object.
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

import convertAudacitySamples from './operations/audacity-samples'

/**
 * A collection of functions to manipulate the media asset and presentation
 * files.
 */
export const operations = {
  convertAsset,
  convertAudacitySamples,
  fixTypography,
  generateAutomaticPresentation,
  generateCloze,
  initializeMetaYaml,
  moveAsset,
  normalize,
  normalizeMediaAsset,
  normalizePresentationFile,
  patchTexTitles,
  removeWidthHeightInSvg,
  renameByRef,
  renameMediaAsset
}
