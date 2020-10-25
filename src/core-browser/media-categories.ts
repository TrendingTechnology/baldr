/**
 * Categories some asset file formats in asset types.
 *
 * @module @bldr/core-browser/asset-types
 */

import { Configuration } from '@bldr/type-definitions'

interface SpreadExtensionCollection {
  [key: string]: string
}

/**
 * Classifies some media asset file formats in this categories:
 * `audio`, `image`, `video`, `document`.
 */
export class MediaCategoriesManager {
  private config

  private allowedExtensions: SpreadExtensionCollection

  /**
   * @param config The configuration of the BALDR project. It has to be
   * specifed as a argument and is not imported via the module
   * `@bldr/config` to able to use this class in Vue projects.
   */
  constructor (config: Configuration) {
    this.config = config.mediaServer.assetTypes
    this.allowedExtensions = this.spreadExtensions()
  }

  private spreadExtensions (): SpreadExtensionCollection {
    const out: SpreadExtensionCollection = {}
    for (const type in this.config) {
      for (const extension of this.config[type].allowedExtensions) {
        out[extension] = type
      }
    }
    return out
  }

  /**
   * Get the media type from the extension.
   *
   * @param extension
   */
  extensionToType (extension: string): string {
    extension = extension.toLowerCase()
    if (extension in this.allowedExtensions) {
      return this.allowedExtensions[extension]
    }
    throw new Error(`Unkown extension “${extension}”`)
  }

  /**
   * Get the color of the media type.
   *
   * @param type - The asset type: for example `audio`, `image`,
   *   `video`.
   */
  typeToColor (type: string): string {
    return this.config[type].color
  }

  /**
   * Determine the target extension (for a conversion job) by a given
   * asset type.
   *
   * @param type - The asset type: for example `audio`, `image`,
   *   `video`.
   */
  typeToTargetExtension (type: string): string {
    return this.config[type].targetExtension
  }

  /**
   * Check if file is an supported asset format.
   *
   * @param filename
   */
  isAsset (filename: string): boolean {
    const extension = filename.split('.').pop()
    if (extension && this.allowedExtensions[extension.toLowerCase()]) {
      return true
    }
    return false
  }
}
