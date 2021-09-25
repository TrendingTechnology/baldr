// Node packages.
import path from 'path'

import { getTwoLetterRegExp } from '@bldr/media-categories'
import * as log from '@bldr/log'

// Project packages.
import { moveAsset, readYamlMetaData } from '../main'

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
    if (ref === oldBaseName) {
      return
    }
    log.info('Rename by reference from %s to %s', oldBaseName, ref)
    newPath = path.join(path.dirname(oldPath), `${ref}${extension}`)
    moveAsset(oldPath, newPath)
  }
}
