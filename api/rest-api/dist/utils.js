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
// Project packages.
import { getConfig } from '@bldr/config';
import { database } from './api';
const config = getConfig();
/**
 * Throw an error if the media type is unkown. Provide a default value.
 *
 * @param mediaType - At the moment `asset` and `presentation`
 */
export function validateMediaType(mediaType) {
    const mediaTypes = ['asset', 'presentation'];
    if (mediaType == null) {
        return 'asset';
    }
    if (!mediaTypes.includes(mediaType)) {
        throw new Error(`Unkown media type “${mediaType}”! Allowed media types are: ${mediaTypes.join(', ')}`);
    }
    else {
        return mediaType;
    }
}
/**
 * Resolve a ID from a given media type (`assets`, `presentations`) to a
 * absolute path.
 *
 * @param ref - The ref of the media type.
 * @param mediaType - At the moment `assets` and `presentation`
 */
export function getAbsPathFromRef(ref, mediaType = 'presentation') {
    return __awaiter(this, void 0, void 0, function* () {
        mediaType = validateMediaType(mediaType);
        const result = yield database.db
            .collection(mediaType + 's')
            .find(mediaType === 'presentation' ? { 'meta.ref': ref } : { ref: ref })
            .next();
        let relPath;
        if (mediaType === 'presentation' && typeof result.meta.path === 'string') {
            relPath = result.meta.path;
        }
        else if (typeof result.path === 'string') {
            relPath = String(result.path) + '.yml';
        }
        if (relPath == null) {
            throw new Error(`Can not find media file with the type “${mediaType}” and the reference “${ref}”.`);
        }
        return path.join(config.mediaServer.basePath, relPath);
    });
}
