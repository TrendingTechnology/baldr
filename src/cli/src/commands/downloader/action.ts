import { operations } from '@bldr/media-manager'
import { fetchFile } from '@bldr/core-node'

import type { MediaResolverTypes } from '@bldr/type-definitions'

/**
 * Download a media asset.
 *
 * @param url - The source URL.
 * @param id - The ID of the destination file.
 * @param extension - The extension of the destination file.
 */
async function action (url: string, id?: string, extension?: string): Promise<void> {
  if (extension == null) {
    extension = url.substring(url.lastIndexOf('.') + 1)
  }

  if (id == null) {
    id = url.substring(url.lastIndexOf('/') + 1)
    id = id.replace(/\.\w+$/, '')
  }

  const destFile = `${id}.${extension}`

  await fetchFile(url, destFile)
  // Make images smaller.
  const convertedDestFile = await operations.convertAsset(destFile)
  if (convertedDestFile != null) {
    const metaData = { source: url }
    const meta = metaData as unknown
    await operations.initializeMetaYaml(destFile, meta as MediaResolverTypes.YamlFormat)
  }
}

export = action
