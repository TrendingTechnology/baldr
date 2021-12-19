import { MediaType } from '../utils';
interface OpenEditorResult {
    ref: string;
    mediaType: MediaType;
    absPath: string;
    parentFolder: string;
    editor: string;
}
/**
 * Open a media file specified by an ID with an editor specified in
 *   `config.mediaServer.editor` (`/etc/baldr.json`).
 *
 * @param ref - The ref of the media type.
 * @param mediaType - At the moment `assets` and `presentation`
 */
export default function (ref: string, mediaType: MediaType, dryRun?: boolean): Promise<OpenEditorResult>;
export {};
