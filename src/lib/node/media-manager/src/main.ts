/**
 * Manage the media files in the media server directory (create,
 * normalize metadata files, rename media files, normalize the
 * presentation content file).
 *
 * @module @bldr/media-manager
 */

import fs from 'fs'

import { getExtension } from '@bldr/core-browser'
import { MediaResolverTypes } from '@bldr/type-definitions'
import { readYamlFile } from '@bldr/file-reader-writer'
import * as log from '@bldr/log'

export * from './operations'
export * from './directory-tree-walk'
export * from './location-indicator'
export * from './media-file-classes'
export * from './yaml'

export function setLogLevel (level: number): void {
  log.setLogLevel(level)
}

/**
 * Read the corresponding YAML file of a media asset.
 *
 * @param filePath - The path of the media asset (without the
 *   extension `.yml`).
 */
export function readAssetYaml (
  filePath: string
): MediaResolverTypes.YamlFormat | undefined {
  const extension = getExtension(filePath)
  if (extension !== 'yml') {
    filePath = `${filePath}.yml`
  }
  if (fs.existsSync(filePath)) {
    return readYamlFile(filePath) as MediaResolverTypes.YamlFormat
  }
}
