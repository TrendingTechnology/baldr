import { MediaResolverTypes } from '@bldr/type-definitions'

import { operations } from '../operations'
import { writeYamlMetaData } from '../yaml'

/**
 * Rename, create metadata yaml and normalize the metadata file.
 */
export async function initializeMetaYaml (
  filePath: string,
  metaData?: MediaResolverTypes.YamlFormat
): Promise<void> {
  const newPath = operations.renameMediaAsset(filePath)
  await writeYamlMetaData(newPath, metaData)
  await operations.normalizeMediaAsset(newPath, { wikidata: false })
}
