import { AssetType } from '@bldr/type-definitions'

import { renameMediaAsset } from './rename-asset'
import { normalizeMediaAsset } from './normalize-asset'
import { writeMetaDataYaml } from '../yaml'

/**
 * Rename, create metadata yaml and normalize the metadata file.
 *
 * @param filePath
 * @param metaData
 */
export async function initializeMetaYaml (filePath: string, metaData?: AssetType.FileFormat | AssetType.Generic) {
  const newPath = renameMediaAsset(filePath)
  writeMetaDataYaml(newPath, metaData)
  await normalizeMediaAsset(newPath, { wikidata: false })
}
