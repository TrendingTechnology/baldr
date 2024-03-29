var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getConfig } from '@bldr/config';
import { getHttp } from '@bldr/media-resolver';
const config = getConfig();
export function convertYoutubeIdToUri(youtubeId) {
    return `ref:YT_${youtubeId}`;
}
/**
 * https://stackoverflow.com/a/55890696/10193818
 *
 * Low quality
 * https://img.youtube.com/vi/[video-id]/sddefault.jpg
 *
 * medium quality
 * https://img.youtube.com/vi/[video-id]/mqdefault.jpg
 *
 * High quality
 * http://img.youtube.com/vi/[video-id]/hqdefault.jpg
 *
 * maximum resolution
 * http://img.youtube.com/vi/[video-id]/maxresdefault.jpg
 */
export function findPreviewHttpUrl(youtubeId, asset) {
    if (asset == null) {
        return `http://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
    }
    else {
        return asset.previewHttpUrl;
    }
}
export function getSnippet(youtubeId) {
    return __awaiter(this, void 0, void 0, function* () {
        const snippet = yield getHttp('https://www.googleapis.com/youtube/v3/videos', {
            params: {
                part: 'snippet',
                id: youtubeId,
                key: config.youtube.apiKey
            }
        });
        if (snippet.data.items.length > 0) {
            return snippet.data.items[0].snippet;
        }
    });
}
export function checkAvailability(youtubeId) {
    return __awaiter(this, void 0, void 0, function* () {
        const snippet = yield getSnippet(youtubeId);
        if (snippet != null)
            return true;
        return false;
    });
}
export class YoutubeMaster {
    constructor() {
        this.name = 'youtube';
        this.displayName = 'YouTube';
        this.icon = {
            name: 'master-youtube',
            color: 'red',
            /**
             * U+1F534
             *
             * @see https://emojipedia.org/large-red-circle/
             */
            unicodeSymbol: '🔴'
        };
        this.fieldsDefintion = {
            youtubeId: {
                type: String,
                required: true,
                description: 'Die Youtube-ID (z. B. xtKavZG1KiM).'
            },
            heading: {
                type: String,
                description: 'Eigene Überschrift',
                markup: true
            },
            info: {
                type: String,
                description: 'längerer Informations-Text',
                markup: true
            }
        };
        this.shortFormField = 'youtubeId';
    }
    collectOptionalMediaUris(fields) {
        return convertYoutubeIdToUri(fields.youtubeId);
    }
}
