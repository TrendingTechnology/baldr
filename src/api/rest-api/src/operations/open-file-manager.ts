import path from 'path'

import { openInFileManager } from '@bldr/open-with'

import openArchivesInFileManager from './open-archives-in-file-manager'

import { getAbsPathFromRef } from '../utils'
import { MediaType } from '../modules/media'

interface OpenFileManagerResult {
  ref: string
  parentFolder: string
  mediaType: MediaType
  openArchiveFolder: boolean
  createParentDir: boolean
}

/**
 * Open the parent folder of a presentation, a media asset in a file explorer
 * GUI application.
 *
 * @param ref - The ref of the media type.
 * @param mediaType - At the moment `assets` and `presentation`
 * @param openArchiveFolder - Addtionaly open the corresponding archive
 *   folder.
 * @param createParentDir - Create the directory structure of
 *   the relative path in the archive in a recursive manner.
 */
export default async function (
  ref: string,
  mediaType: MediaType,
  openArchiveFolder: boolean,
  createParentDir: boolean,
  dryRun: boolean = false
): Promise<OpenFileManagerResult> {
  const absPath = await getAbsPathFromRef(ref, mediaType)
  const parentFolder = path.dirname(absPath)
  if (!dryRun) {
    if (openArchiveFolder) {
      openArchivesInFileManager(parentFolder, createParentDir)
    } else {
      openInFileManager(parentFolder, createParentDir)
    }
  }
  return {
    ref,
    parentFolder,
    mediaType,
    openArchiveFolder,
    createParentDir
  }
}
