// Node packages.
import fs from 'fs'
import path from 'path'

// Project packages.
import { getConfig } from '@bldr/config'
import { locationIndicator } from '@bldr/media-manager'
import { openWith, openInFileManager } from '@bldr/open-with'
import { StringIndexedObject } from '@bldr/type-definitions'

import { database } from './main'

export type MediaType = 'assets' | 'presentations'

const config = getConfig()

/**
 * Throw an error if the media type is unkown. Provide a default value.
 *
 * @param mediaType - At the moment `assets` and `presentation`
 */
export function validateMediaType (mediaType: string): MediaType {
  const mediaTypes = ['assets', 'presentations']
  if (mediaType == null) return 'assets'
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
async function getAbsPathFromId (
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

/**
 * Open the current path multiple times.
 *
 * 1. In the main media server directory
 * 2. In a archive directory structure.
 * 3. In a second archive directory structure ... and so on.
 *
 * @param currentPath
 * @param create - Create the directory structure of
 *   the given `currentPath` in a recursive manner.
 */
export function openArchivesInFileManager (
  currentPath: string,
  create: boolean
): StringIndexedObject {
  const result: StringIndexedObject = {}
  const relPath = locationIndicator.getRelPath(currentPath)
  for (const basePath of locationIndicator.basePaths) {
    if (relPath != null) {
      const currentPath = path.join(basePath, relPath)
      result[currentPath] = openInFileManager(currentPath, create)
    } else {
      result[basePath] = openInFileManager(basePath, create)
    }
  }
  return result
}

/**
 * Open a media file specified by an ID with an editor specified in
 *   `config.mediaServer.editor` (`/etc/baldr.json`).
 *
 * @param ref - The ref of the media type.
 * @param mediaType - At the moment `assets` and `presentation`
 */
export async function openEditor (
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
export async function openParentFolder (
  ref: string,
  mediaType: MediaType,
  archive: boolean,
  create: boolean
): Promise<StringIndexedObject> {
  const absPath = await getAbsPathFromId(ref, mediaType)
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
