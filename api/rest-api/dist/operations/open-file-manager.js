var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
export default function (ref, mediaType, openArchiveFolder, createParentDir, dryRun = false) {
    return __awaiter(this, void 0, void 0, function* () {
        const absPath = yield getAbsPathFromRef(ref, mediaType);
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
    });
}
