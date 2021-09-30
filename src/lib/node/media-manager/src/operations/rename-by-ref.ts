// Node packages.
import path from 'path'

import * as log from '@bldr/log'

// Project packages.
import { moveAsset, readYamlMetaData } from '../main'
import { locationIndicator } from '../location-indicator'

/**
 * Rename a media asset after the `ref` (reference) property in the metadata file.
 *
 * @param filePath - The media asset file path.
 */
export function renameByRef (filePath: string): void {
  let result: { [key: string]: any }
  try {
    result = readYamlMetaData(filePath)
  } catch (error) {
    log.error(error)
    return
  }

  if (result.ref != null) {
    let ref: string = result.ref
    const oldPath = filePath

    const refs = locationIndicator.getRefOfSegments(filePath)

    // 10_Ausstellung-Ueberblick/NB/01_Gnom.svg.yml
    // ref: Ausstellung-Ueberblick_NB_01_Gnom
    // -> 01_Gnom

    // 10_Ausstellung-Ueberblick/YT/sPg1qlLjUVQ.mp4.yml
    // ref: YT_sPg1qlLjUVQ
    // -> sPg1qlLjUVQ
    if (refs != null) {
      for (const pathRef of refs) {
        ref = ref.replace(new RegExp(`^${pathRef}`), '')
        ref = ref.replace(/^_/, '')
      }
    }

    // Old approach:
    // ref = ref.replace(new RegExp('.*_' + getTwoLetterRegExp() + '_'), '')

    // .mp4
    const extension = path.extname(oldPath)
    const oldBaseName = path.basename(oldPath, extension)
    let newPath = null
    if (ref === oldBaseName) {
      return
    }
    log.info('Rename by reference from %s to %s', oldBaseName, ref)
    newPath = path.join(path.dirname(oldPath), `${ref}${extension}`)
    moveAsset(oldPath, newPath)
  }
}
