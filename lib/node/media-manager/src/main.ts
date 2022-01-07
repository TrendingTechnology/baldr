/**
 * Manage the media files in the media server directory (create,
 * normalize metadata files, rename media files, normalize the
 * presentation content file).
 *
 * @module @bldr/media-manager
 */

import * as log from '@bldr/log'

export { buildMinimalAssetData } from '@bldr/media-data-collector'
export { mimeTypeManager } from '@bldr/client-media-models'

export { operations } from './operations'
export { walk } from './directory-tree-walk'
export { locationIndicator } from './location-indicator'
export { isAsset, isPresentation, isTex } from './media-file-classes'
export { readYamlMetaData, writeYamlMetaData } from './yaml'

export function setLogLevel (level: number): void {
  log.setLogLevel(level)
}
