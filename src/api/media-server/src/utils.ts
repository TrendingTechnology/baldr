// Node packages.
import path from 'path'

// Project packages.
import { getConfig } from '@bldr/config'

import { database } from './rest-api'

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
export async function getAbsPathFromId (
  ref: string,
  mediaType: MediaType = 'presentations'
): Promise<string> {
  mediaType = validateMediaType(mediaType)
  const result = await database.db
    .collection(mediaType)
    .find({ ref: ref })
    .next()
  if (result.path == null && typeof result.path !== 'string') {
    throw new Error(
      `Can not find media file with the type “${mediaType}” and the reference “${ref}”.`
    )
  }

  let relPath: string = result.path
  if (mediaType === 'assets') {
    relPath = `${relPath}.yml`
  }
  return path.join(config.mediaServer.basePath, relPath)
}
