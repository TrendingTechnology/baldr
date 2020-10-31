import { operations } from '@bldr/media-manager'
import { fetchFile } from '@bldr/core-node'

/**
 * Download a media asset.
 *
 * @param url - The source URL.
 * @param id - The ID of the destination file.
 * @param extension - The extension of the destination file.
 */
async function action (url: string, id: string = null, extension: string = null) {
  if (!extension) {
    extension = url.substring(url.lastIndexOf('.') + 1)
  }

  if (!id) {
    id = url.substring(url.lastIndexOf('/') + 1)
    id = id.replace(/\.\w+$/, '')
  }

  let destFile = `${id}.${extension}`

  await fetchFile(url, destFile)
  // Make images smaller.
  destFile = await operations.convertAsset(destFile)
  await operations.initializeMetaYaml(destFile, { source: url })
}

export = action
