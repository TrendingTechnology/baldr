import path from 'path'

import { locationIndicator } from '@bldr/media-manager'
import { StringIndexedObject } from '@bldr/type-definitions'
import { openInFileManager } from '@bldr/open-with'

/**
 * Open the current path multiple times.
 *
 * 1. In the main media server directory
 * 2. In a archive directory structure.
 * 3. In a second archive directory structure ... and so on.
 *
 * @param currentPath
 * @param create - Create the directory structure of
 *   the given `currentPath` in a recursive manner.
 */
export default function (
  currentPath: string,
  create: boolean
): StringIndexedObject {
  const result: StringIndexedObject = {}
  const relPath = locationIndicator.getRelPath(currentPath)
  for (const basePath of locationIndicator.basePaths) {
    if (relPath != null) {
      const currentPath = path.join(basePath, relPath)
      result[currentPath] = openInFileManager(currentPath, create)
    } else {
      result[basePath] = openInFileManager(basePath, create)
    }
  }
  return result
}
