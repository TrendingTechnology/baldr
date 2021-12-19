import path from 'path'

import { locationIndicator } from '@bldr/media-manager'
import { openInFileManager } from '@bldr/open-with'

interface OpenInFileManagerResult {
  fileManager: string
  filePath: string
  parentDir: string
  opened: boolean
  createdParentDir: boolean
}

/**
 * Open the current path multiple times.
 *
 * 1. In the main media server directory
 * 2. In a archive directory structure.
 * 3. In a second archive directory structure ... and so on.
 *
 * @param filePath
 * @param createParentDir - Create the directory structure of
 *   the given `currentPath` in a recursive manner.
 */
export default function (
  filePath: string,
  createParentDir: boolean
): OpenInFileManagerResult[] {
  const relPath = locationIndicator.getRelPath(filePath)
  const filePaths: string[] = []
  for (const basePath of locationIndicator.basePaths) {
    filePaths.push(relPath != null ? path.join(basePath, relPath) : basePath)
  }
  const results = openInFileManager(filePaths, createParentDir)

  results.map(result => {
    delete result.process
  })

  return results
}
