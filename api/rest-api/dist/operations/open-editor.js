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
import fs from 'fs';
import { openWith } from '@bldr/open-with';
import { getConfig } from '@bldr/config';
import { getAbsPathFromRef } from '../utils';
const config = getConfig();
/**
 * Open a media file specified by an ID with an editor specified in
 *   `config.mediaServer.editor` (`/etc/baldr.json`).
 *
 * @param ref - The ref of the media type.
 * @param mediaType - At the moment `assets` and `presentation`
 */
export default function (ref, mediaType, dryRun = false) {
    return __awaiter(this, void 0, void 0, function* () {
        const absPath = yield getAbsPathFromRef(ref, mediaType);
        const parentFolder = path.dirname(absPath);
        const editor = config.mediaServer.editor;
        if (!fs.existsSync(editor)) {
            throw new Error(`Editor “${editor}” can’t be found.`);
        }
        if (!dryRun) {
            openWith(editor, parentFolder);
        }
        return {
            ref,
            mediaType,
            absPath,
            parentFolder,
            editor
        };
    });
}
