import path from 'path'

import { getExtension, asciify } from '@bldr/core-browser'
import { AssetType } from '@bldr/type-definitions'

import { categoriesManagement } from '@bldr/media-categories'

import { readAssetYaml, moveAsset } from '../main'

/**
 * Rename a media asset and its meta data files.
 *
 * @param oldPath - The media file path.
 *
 * @returns The new file name.
 */
export function renameMediaAsset (oldPath: string): string {
  const metaData = readAssetYaml(oldPath)
  let newPath
  if (metaData?.categories != null) {
    metaData.extension = getExtension(oldPath)
    metaData.filePath = oldPath
    const data = metaData as AssetType.Intermediate
    newPath = categoriesManagement.formatFilePath(data, oldPath)
  }

  if (newPath == null) newPath = asciify(oldPath)
  const basename = path.basename(newPath)
  // Remove a- and v- prefixes
  const cleanedBasename = basename.replace(/^[va]-/g, '')
  if (cleanedBasename !== basename) {
    newPath = path.join(path.dirname(newPath), cleanedBasename)
  }
  moveAsset(oldPath, newPath)
  return newPath
}
