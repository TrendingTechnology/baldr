// Operations
import { convertAsset } from './operations/convert-asset'
import { fixTypography } from './operations/fix-typography'
import { generateCloze } from './operations/cloze'
import { generatePresentation } from './operations/generate-presentation'
import { initializeMetaYaml } from './operations/initialize-meta-yaml'
import { normalizeMediaAsset } from './operations/normalize-asset'
import { normalizePresentationFile } from './operations/normalize-presentation'
import { patchTexTitles } from './operations/patch-tex-titles'
import { renameByRef } from './operations/rename-by-ref'
import { renameMediaAsset } from './operations/rename-asset'

/**
 * A collection of functions to manipulate the media assets and presentation files.
 */
export const operations = {
  convertAsset,
  fixTypography,
  generateCloze,
  generatePresentation,
  initializeMetaYaml,
  normalizeMediaAsset,
  normalizePresentationFile,
  patchTexTitles,
  renameByRef,
  renameMediaAsset
}
