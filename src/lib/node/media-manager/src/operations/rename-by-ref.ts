// Node packages.
import path from 'path'

// Project packages.
import { moveAsset, readYamlMetaData } from '../main'
import { getTwoLetterRegExp } from '@bldr/media-categories'
import { walk } from '../directory-tree-walk'
import { locationIndicator } from '../location-indicator'

/**
 * Rename a media asset after the `ref` in the meta data file.
 *
 * @param filePath - The media asset file path.
 */
export function renameByRef (filePath: string): void {
  let result: { [key: string]: any }
  try {
    result = readYamlMetaData(filePath)
  } catch (error) {
    return
  }

  if (result.ref != null) {
    let ref: string = result.ref
    const oldPath = filePath

    // .mp4
    const extension = path.extname(oldPath)
    const oldBaseName = path.basename(oldPath, extension)
    let newPath = null
    // Gregorianik_HB_Alleluia-Ostermesse -> Alleluia-Ostermesse
    ref = ref.replace(new RegExp('.*_' + getTwoLetterRegExp() + '_'), '')
    if (ref !== oldBaseName) {
      newPath = path.join(path.dirname(oldPath), `${ref}${extension}`)
    } else {
      return
    }
    moveAsset(oldPath, newPath)
  }
}

/**
 * Rename all files which are in the same parent presentation folder
 * as the specified file path.
 *
 * @param filePath - All files which are in the same parent presentation folder
 *   as this file path are renamed.
 */
export async function renameAllInPresDirByRef (
  filePath: string
): Promise<void> {
  const parentDir = locationIndicator.getPresParentDir(filePath)

  if (parentDir == null) {
    return
  }

  await walk(
    {
      everyFile (filePath) {
        renameByRef(filePath)
      }
    },
    { path: parentDir }
  )
}
