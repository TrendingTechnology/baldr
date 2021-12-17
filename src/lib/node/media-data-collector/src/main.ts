import { AssetBuilder, DbAssetData, MinimalAssetData } from './asset-builder'
import {
  PresentationBuilder,
  PresentationData,
  DbPresentationData
} from './presentation-builder'

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
  return builder.build()
}

export function buildDbPresentationData (filePath: string): DbPresentationData {
  const builder = new PresentationBuilder(filePath)
  return builder.buildForDb()
}
