import path from 'path'
import fs from 'fs'

import { StringIndexedObject } from '@bldr/type-definitions'
import { openWith } from '@bldr/open-with'
import { getConfig } from '@bldr/config'

import { MediaType, getAbsPathFromId } from '../utils'

const config = getConfig()

/**
 * Open a media file specified by an ID with an editor specified in
 *   `config.mediaServer.editor` (`/etc/baldr.json`).
 *
 * @param ref - The ref of the media type.
 * @param mediaType - At the moment `assets` and `presentation`
 */
export default async function (
  ref: string,
  mediaType: MediaType
): Promise<StringIndexedObject> {
  const absPath = await getAbsPathFromId(ref, mediaType)
  const parentFolder = path.dirname(absPath)
  const editor = config.mediaServer.editor
  if (!fs.existsSync(editor)) {
    return {
      error: `Editor “${editor}” can’t be found.`
    }
  }
  openWith(config.mediaServer.editor, parentFolder)
  return {
    ref,
    mediaType,
    absPath,
    parentFolder,
    editor
  }
}
