"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.YoutubeMaster = exports.checkAvailability = exports.getSnippet = void 0;
const config_1 = require("@bldr/config");
const media_resolver_ng_1 = require("@bldr/media-resolver-ng");
const config = config_1.getConfig();
function getSnippet(youtubeId) {
    return __awaiter(this, void 0, void 0, function* () {
        const snippet = yield media_resolver_ng_1.get('https://www.googleapis.com/youtube/v3/videos', {
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
exports.getSnippet = getSnippet;
function checkAvailability(youtubeId) {
    return __awaiter(this, void 0, void 0, function* () {
        const snippet = yield getSnippet(youtubeId);
        if (snippet != null)
            return true;
        return false;
    });
}
exports.checkAvailability = checkAvailability;
class YoutubeMaster {
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
exports.YoutubeMaster = YoutubeMaster;
