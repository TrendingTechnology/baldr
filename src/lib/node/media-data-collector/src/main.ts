import { AssetBuilder, DbAssetData, MinimalAssetData } from './asset-builder'
import { PresentationBuilder, PresentationData } from './presentation-builder'

export function buildDbAssetData (filePath: string): DbAssetData {
  const builder = new AssetBuilder(filePath)
  return builder.buildForDb()
}

export function buildMinimalAssetData (filePath: string): MinimalAssetData {
  const builder = new AssetBuilder(filePath)
  return builder.buildMinimal()
}

export function buildPresentationData (filePath: string): PresentationData {
  const builder = new PresentationBuilder(filePath)
  builder.buildAll()
  return builder.export()
}
