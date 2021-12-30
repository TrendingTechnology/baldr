import path from 'path'
import fs from 'fs'

import { openWith } from '@bldr/open-with'
import { getConfig } from '@bldr/config'
import { ApiTypes } from '@bldr/type-definitions'

import { getAbsPathFromRef } from '../utils'

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
  mediaType: ApiTypes.MediaType,
  dryRun: boolean = false
): Promise<ApiTypes.OpenEditorResult> {
  const absPath = await getAbsPathFromRef(ref, mediaType)
  const parentFolder = path.dirname(absPath)
  const editor = config.mediaServer.editor
  if (!fs.existsSync(editor)) {
    throw new Error(`Editor “${editor}” can’t be found.`)
  }
  if (!dryRun) {
    openWith(editor, parentFolder)
  }
  return {
    ref,
    mediaType,
    absPath,
    parentFolder,
    editor
  }
}
