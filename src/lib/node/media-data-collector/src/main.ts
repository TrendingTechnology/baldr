import { MediaDataTypes } from '@bldr/type-definitions'

import { AssetBuilder } from './asset-builder'
import { PresentationBuilder } from './presentation-builder'

export function buildDbAssetData (
  filePath: string
): MediaDataTypes.AssetMetaData {
  const builder = new AssetBuilder(filePath)
  return builder.buildForDb()
}

export function buildMinimalAssetData (
  filePath: string
): MediaDataTypes.MinimalAssetMetaData {
  const builder = new AssetBuilder(filePath)
  return builder.buildMinimal()
}

export function buildPresentationData (
  filePath: string
): MediaDataTypes.PresentationData {
  const builder = new PresentationBuilder(filePath)
  return builder.build()
}
