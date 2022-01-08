import path from 'path';
import { openInFileManager } from '@bldr/open-with';
import openArchivesInFileManager from './open-archives-in-file-manager';
import { getAbsPathFromRef } from '../utils';
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
export default async function (ref, mediaType, openArchiveFolder, createParentDir, dryRun = false) {
    const absPath = await getAbsPathFromRef(ref, mediaType);
    const parentFolder = path.dirname(absPath);
    let parentFolders = [];
    if (!dryRun) {
        if (openArchiveFolder) {
            const results = openArchivesInFileManager(parentFolder, createParentDir);
            parentFolders = results.map(results => {
                return results.parentDir;
            });
        }
        else {
            openInFileManager(parentFolder, createParentDir);
            parentFolders = [parentFolder];
        }
    }
    return {
        ref,
        absPath,
        parentFolders,
        mediaType,
        openArchiveFolder,
        createParentDir
    };
}
