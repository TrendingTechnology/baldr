import path from 'path'

import { openInFileManager } from '@bldr/open-with'
import { StringIndexedObject } from '@bldr/type-definitions'

import openArchivesInFileManager from './open-archives-in-file-manager'

import { MediaType, getAbsPathFromRef } from '../utils'

/**
 * Open the parent folder of a presentation, a media asset in a file explorer
 * GUI application.
 *
 * @param ref - The ref of the media type.
 * @param mediaType - At the moment `assets` and `presentation`
 * @param archive - Addtionaly open the corresponding archive
 *   folder.
 * @param create - Create the directory structure of
 *   the relative path in the archive in a recursive manner.
 */
export default async function (
  ref: string,
  mediaType: MediaType,
  archive: boolean,
  create: boolean
): Promise<StringIndexedObject> {
  const absPath = await getAbsPathFromRef(ref, mediaType)
  const parentFolder = path.dirname(absPath)

  let result: StringIndexedObject
  if (archive) {
    result = openArchivesInFileManager(parentFolder, create)
  } else {
    result = openInFileManager(parentFolder, create)
  }
  return {
    ref,
    parentFolder,
    mediaType,
    archive,
    create,
    result
  }
}
