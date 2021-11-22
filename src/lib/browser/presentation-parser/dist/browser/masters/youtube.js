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
import { get } from '@bldr/media-resolver-ng';
const config = getConfig();
export function getSnippet(youtubeId) {
    return __awaiter(this, void 0, void 0, function* () {
        const snippet = yield get('https://www.googleapis.com/youtube/v3/videos', {
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
            name: 'youtube',
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
        return this.convertYoutubeIdToUri(fields.youtubeId);
    }
    convertYoutubeIdToUri(youtubeId) {
        return `ref:YT_${youtubeId}`;
    }
}
