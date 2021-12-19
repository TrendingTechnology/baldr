import { MediaType } from '../modules/media';
interface OpenFileManagerResult {
    ref: string;
    parentFolder: string;
    mediaType: MediaType;
    openArchiveFolder: boolean;
    createParentDir: boolean;
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
export default function (ref: string, mediaType: MediaType, openArchiveFolder: boolean, createParentDir: boolean, dryRun?: boolean): Promise<OpenFileManagerResult>;
export {};
