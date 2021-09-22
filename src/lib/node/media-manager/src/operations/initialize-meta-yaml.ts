import { MediaResolverTypes } from '@bldr/type-definitions'

import { renameMediaAsset } from './rename-asset'
import { normalizeMediaAsset } from './normalize-asset'
import { writeYamlMetaData } from '../yaml'

/**
 * Rename, create metadata yaml and normalize the metadata file.
 */
export async function initializeMetaYaml (
  filePath: string,
  metaData?: MediaResolverTypes.YamlFormat
): Promise<void> {
  const newPath = renameMediaAsset(filePath)
  writeYamlMetaData(newPath, metaData)
  await normalizeMediaAsset(newPath, { wikidata: false })
}
