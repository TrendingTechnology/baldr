import { StringIndexedObject } from '@bldr/type-definitions';
import { MediaType } from '../utils';
/**
 * Open a media file specified by an ID with an editor specified in
 *   `config.mediaServer.editor` (`/etc/baldr.json`).
 *
 * @param ref - The ref of the media type.
 * @param mediaType - At the moment `assets` and `presentation`
 */
export default function (ref: string, mediaType: MediaType): Promise<StringIndexedObject>;
