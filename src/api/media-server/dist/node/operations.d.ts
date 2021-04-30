import type { StringIndexedObject } from '@bldr/type-definitions';
export declare type MediaType = 'assets' | 'presentations';
/**
 * Throw an error if the media type is unkown. Provide a default value.
 *
 * @param mediaType - At the moment `assets` and `presentation`
 */
export declare function validateMediaType(mediaType: string): MediaType;
/**
 * Open a media file specified by an ID with an editor specified in
 *   `config.mediaServer.editor` (`/etc/baldr.json`).
 *
 * @param ref - The ref of the media type.
 * @param mediaType - At the moment `assets` and `presentation`
 */
export declare function openEditor(ref: string, mediaType: MediaType): Promise<StringIndexedObject>;
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
export declare function openParentFolder(ref: string, mediaType: MediaType, archive: boolean, create: boolean): Promise<StringIndexedObject>;
