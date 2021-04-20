/**
 * Manage the media files in the media server directory (create,
 * normalize metadata files, rename media files, normalize the
 * presentation content file).
 *
 * @module @bldr/media-manager
 */

import fs from 'fs'
import path from 'path'

import { getExtension } from '@bldr/core-browser'
import { AssetType } from '@bldr/type-definitions'

import { DeepTitle, TitleTree } from '@bldr/titles'
import { loadYaml } from './yaml'

// Operations
import { convertAsset } from './operations/convert-asset'
import { generatePresentation } from './operations/generate-presentation'
import { initializeMetaYaml } from './operations/initialize-meta-yaml'
import { normalizeMediaAsset } from './operations/normalize-asset'
import { normalizePresentationFile } from './operations/normalize-presentation'
import { renameMediaAsset } from './operations/rename-asset'

/**
 * A collection of function to manipulate the media assets and presentation files.
 */
export const operations = {
  convertAsset,
  generatePresentation,
  initializeMetaYaml,
  normalizeMediaAsset,
  normalizePresentationFile,
  renameMediaAsset
}

export * from './directory-tree-walk'
export * from './location-indicator'
export * from './media-file-classes'
export * from './yaml'

interface MoveAssetConfiguration {
  copy?: boolean
  dryRun?: boolean
}

/**
 * Move (rename) or copy a media asset and it’s corresponding meta data file
 * (`*.yml`) and preview file (`_preview.jpg`).
 *
 * @param oldPath - The old path of a media asset.
 * @param newPath - The new path of a media asset.
 * @param opts - Some options
 */
export function moveAsset (oldPath: string, newPath: string, opts: MoveAssetConfiguration = {}): string | undefined {
  function move (oldPath: string, newPath: string, { copy, dryRun }: MoveAssetConfiguration): void {
    if (copy != null && copy) {
      if (!(dryRun != null && dryRun)) fs.copyFileSync(oldPath, newPath)
    } else {
      if (!(dryRun != null && dryRun)) {
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

  function moveCorrespondingFile (oldPath: string, newPath: string, search: RegExp, replace: string, opts: MoveAssetConfiguration): void {
    oldPath = oldPath.replace(search, replace)
    if (fs.existsSync(oldPath)) {
      newPath = newPath.replace(search, replace)
      move(oldPath, newPath, opts)
    }
  }

  if (newPath != null && oldPath !== newPath) {
    if (!(opts.dryRun != null && opts.dryRun)) fs.mkdirSync(path.dirname(newPath), { recursive: true })

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
 * Read the corresponding YAML file of a media asset.
 *
 * @param filePath - The path of the media asset (without the
 *   extension `.yml`).
 */
export function readAssetYaml (filePath: string): AssetType.FileFormat | AssetType.Generic | undefined {
  const extension = getExtension(filePath)
  if (extension !== 'yml') filePath = `${filePath}.yml`
  if (fs.existsSync(filePath)) {
    return loadYaml(filePath)
  }
}

export default {
  DeepTitle,
  TitleTree
}
