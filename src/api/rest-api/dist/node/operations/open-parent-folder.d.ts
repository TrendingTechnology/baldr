import { StringIndexedObject } from '@bldr/type-definitions';
import { MediaType } from '../modules/media';
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
export default function (ref: string, mediaType: MediaType, archive: boolean, create: boolean): Promise<StringIndexedObject>;
