import { AssetBuilder, AssetData } from './asset-builder'
import { PresentationBuilder, PresentationData } from './presentation-builder'

export function readAssetFile (filePath: string): AssetData {
  const builder = new AssetBuilder(filePath)
  builder.buildAll()
  return builder.export()
}

export function readPresentationFile (filePath: string): PresentationData {
  const builder = new PresentationBuilder(filePath)
  builder.buildAll()
  return builder.export()
}
