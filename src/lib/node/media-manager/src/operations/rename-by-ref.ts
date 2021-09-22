// Node packages.
import path from 'path'

// Project packages.
import { moveAsset, readYamlMetaData } from '../main'

/**
 * Rename a media asset after the `id` in the meta data file.
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
    ref = ref.replace(/.*_[A-Z]{2,}_/, '')
    if (ref !== oldBaseName) {
      newPath = path.join(path.dirname(oldPath), `${ref}${extension}`)
    } else {
      return
    }
    moveAsset(oldPath, newPath)
  }
}
