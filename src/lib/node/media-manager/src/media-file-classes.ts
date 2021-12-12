// Node packages.
import path from 'path'

import { MediaResolverTypes } from '@bldr/type-definitions'
import { getExtension } from '@bldr/string-format'
import { mimeTypeManager } from '@bldr/client-media-models'

import { readAssetYaml } from './asset'

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
  get extension (): string {
    return getExtension(this.absPath)
  }

  /**
   * The basename (filename without extension) of the file.
   */
  get basename (): string {
    if (this.extension != null) {
      return path.basename(this.absPath, `.${this.extension}`)
    }
    return this.absPath
  }
}

/**
 * A media asset.
 */
export class Asset extends MediaFile {
  private readonly metaData: MediaResolverTypes.YamlFormat | undefined
  /**
   * @param filePath - The file path of the media asset.
   */
  constructor (filePath: string) {
    super(filePath)
    const data = readAssetYaml(this.absPath)
    if (data != null) {
      this.metaData = data
    }
  }

  /**
   * The reference of the media asset. Read from the metadata file.
   */
  get ref (): string | undefined {
    if (this.metaData?.ref != null) {
      return this.metaData.ref
    }
  }

  /**
   * The media category (`image`, `audio`, `video`, `document`)
   */
  get mediaCategory (): string | undefined {
    if (this.extension != null) {
      return mimeTypeManager.extensionToType(this.extension)
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

/**
 * @param filePath - The file path of the media asset.
 */
export function filePathToMimeType (filePath: string): string | undefined {
  const asset = makeAsset(filePath)
  if (asset.extension != null) {
    return mimeTypeManager.extensionToType(asset.extension)
  }
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
    filePath.includes('_waveform.png') || // Preview image
    filePath.match(/_no\d+\./) != null // Multipart asset
  ) {
    return false
  }
  // see .gitignore of media folder
  if (filePath.match(/^.*\/(TX|PT|QL)\/.*.pdf$/) != null) {
    return true
  }
  return mimeTypeManager.isAsset(filePath)
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

/**
 * Check if the given file is a TeX file.
 *
 * @param filePath - The path of the file to check.
 */
export function isTex (filePath: string): boolean {
  if (filePath.match(/\.tex$/) != null) {
    return true
  }
  return false
}
