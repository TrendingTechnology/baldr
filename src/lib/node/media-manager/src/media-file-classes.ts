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
  get extension (): string | undefined {
    return getExtension(this.absPath)
  }

  /**
   * The basename (filename without extension) of the file.
   */
  get basename (): string {
    if (this.extension != null) { return path.basename(this.absPath, `.${this.extension}`) }
    return this.absPath
  }
}

/**
 * A media asset.
 */
export class Asset extends MediaFile {
  private readonly metaData: AssetType.FileFormat | undefined
  /**
   * @param filePath - The file path of the media asset.
   */
  constructor (filePath: string) {
    super(filePath)
    const data = readAssetYaml(this.absPath)
    if (data != null) {
      this.metaData = data as AssetType.FileFormat
    }
  }

  /**
   * The id of the media asset. Read from the metadata file.
   */
  get id (): string | undefined {
    if (this.metaData?.id != null) {
      return this.metaData.id
    }
  }

  /**
   * The media category (`image`, `audio`, `video`, `document`)
   */
  get mediaCategory (): string | undefined {
    if (this.extension != null) {
      return mediaCategoriesManager.extensionToType(this.extension)
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
  if (asset.extension != null) { return mediaCategoriesManager.extensionToType(asset.extension) }
}

/**
 * Check if the given file is a media asset.
 *
 * @param filePath - The path of the file to check.
 */
export function isAsset (filePath: string): boolean {
  if (
    filePath.includes('eps-converted-to.pdf') || // eps converted into pdf by TeX
    filePath.includes('_preview.jpg') || // Preview image
    (filePath.match(/_no\d+\./) != null) // Multipart asset
  ) {
    return false
  }
  // see .gitignore of media folder
  if (filePath.match(new RegExp('^.*/(TX|PT|QL)/.*.pdf$')) != null) return true
  return mediaCategoriesManager.isAsset(filePath)
}

/**
 * Check if the given file is a presentation.
 *
 * @param filePath - The path of the file to check.
 */
export function isPresentation (filePath: string): boolean {
  if (filePath.includes('Praesentation.baldr.yml')) {
    return true
  }
  return false
}
