// Node packages.
import path from 'path'

// Project packages.
import { getConfig } from '@bldr/config'

import { database } from './api'

export type MediaType = 'assets' | 'presentations'

const config = getConfig()

/**
 * Throw an error if the media type is unkown. Provide a default value.
 *
 * @param mediaType - At the moment `assets` and `presentation`
 */
export function validateMediaType (mediaType: string): MediaType {
  const mediaTypes = ['assets', 'presentations']
  if (mediaType == null) {
    return 'assets'
  }
  if (!mediaTypes.includes(mediaType)) {
    throw new Error(
      `Unkown media type “${mediaType}”! Allowed media types are: ${mediaTypes.join(
        ', '
      )}`
    )
  } else {
    return mediaType as MediaType
  }
}

/**
 * Resolve a ID from a given media type (`assets`, `presentations`) to a
 * absolute path.
 *
 * @param ref - The ref of the media type.
 * @param mediaType - At the moment `assets` and `presentation`
 */
export async function getAbsPathFromRef (
  ref: string,
  mediaType: MediaType = 'presentations'
): Promise<string> {
  mediaType = validateMediaType(mediaType)
  const result = await database.db
    .collection(mediaType)
    .find(mediaType === 'presentations' ? { 'meta.ref': ref } : { ref: ref })
    .next()
  let relPath: string | undefined
  if (mediaType === 'presentations' && typeof result.meta.path === 'string') {
    relPath = result.meta.path as string
  } else if (typeof result.path === 'string') {
    relPath = String(result.path) + '.yml'
  }
  if (relPath == null) {
    throw new Error(
      `Can not find media file with the type “${mediaType}” and the reference “${ref}”.`
    )
  }

  return path.join(config.mediaServer.basePath, relPath)
}
