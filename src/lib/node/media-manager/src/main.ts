/**
 * Manage the media files in the media server directory (create,
 * normalize metadata files, rename media files, normalize the
 * presentation content file).
 *
 * @module @bldr/media-manager
 */

import * as log from '@bldr/log'

export * from './operations'
export * from './directory-tree-walk'
export * from './location-indicator'
export * from './media-file-classes'
export * from './yaml'

export { readAssetYaml } from './asset'

export function setLogLevel (level: number): void {
  log.setLogLevel(level)
}
