// Node packages.
import path from 'path'

import { AssetType } from '@bldr/type-definitions'
import { MediaCategoriesManager, getExtension } from '@bldr/core-browser'
import config from '@bldr/config'

import { readAssetYaml } from './main'

/**
 * Base class for the asset and presentation class.
 */
class MediaFile {
  /**
   * The absolute path of the file.
   */
  protected absPath: string
  /**
   * @param filePath - The file path of the media file.
   */
  constructor (filePath: string) {
    this.absPath = path.resolve(filePath)
  }

  /**
   * The file extension of the media file.
   */
  get extension(): string | undefined {
    return getExtension(this.absPath)
  }
  /**
   * The basename (filename without extension) of the file.
   */
  get basename(): string {
    return path.basename(this.absPath, `.${this.extension}`)
  }
}

/**
 * A media asset.
 */
export class Asset extends MediaFile {
  private metaData: AssetType.FileFormat | undefined
  /**
   * @param filePath - The file path of the media asset.
   */
  constructor (filePath: string) {
    super(filePath)
    const data = readAssetYaml(this.absPath)
    if (data) {
      this.metaData = <AssetType.FileFormat> data
    }

  }
}

/**
 * Make a media asset from a file path.
 *
 * @param filePath - The file path of the media asset.
 */
export function makeAsset (filePath: string): Asset {
  return new Asset(filePath)
}

export const mediaCategoriesManager = new MediaCategoriesManager(config)

/**
 * @param filePath - The file path of the media asset.
 */
export function filePathToAssetType (filePath: string): string | undefined {
  const asset = makeAsset(filePath)
  if (asset.extension)
  return mediaCategoriesManager.extensionToType(asset.extension)
}
