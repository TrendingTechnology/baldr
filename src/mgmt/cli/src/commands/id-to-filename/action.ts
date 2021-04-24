// Node packages.
import fs from 'fs'
import path from 'path'

// Project packages.
import { moveAsset, walk, loadMetaDataYaml } from '@bldr/media-manager'

/**
 * Rename a media asset after the `id` in the meta data file.
 *
 * @param filePath - The media asset file path.
 */
function renameFromIdOneFile (filePath: string): void {
  let result: { [key: string]: any }
  try {
    result = loadMetaDataYaml(filePath)
  } catch (error) {
    console.log(filePath)
    console.log(error)
    return
  }

  if (result.id != null) {
    let id: string = result.id
    const oldPath = filePath

    // .mp4
    const extension = path.extname(oldPath)
    const oldBaseName = path.basename(oldPath, extension)
    let newPath = null
    // Gregorianik_HB_Alleluia-Ostermesse -> Alleluia-Ostermesse
    id = id.replace(/.*_[A-Z]{2,}_/, '')
    console.log(id)
    if (id !== oldBaseName) {
      newPath = path.join(path.dirname(oldPath), `${id}${extension}`)
    } else {
      return
    }
    moveAsset(oldPath, newPath)
  }
}

/**
 * Rename a media asset or all child asset of the parent working directory
 * after the `id` in the meta data file.
 *
 * @param files - An array of input files, comes from the commanders’
 *   variadic parameter `[files...]`.
 */
async function action (files: string[]): Promise<void> {
  await walk({
    asset (relPath) {
      if (fs.existsSync(`${relPath}.yml`)) {
        renameFromIdOneFile(relPath)
      }
    }
  }, {
    path: files
  })
}

module.exports = action
