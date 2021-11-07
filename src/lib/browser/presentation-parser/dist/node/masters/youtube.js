"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YoutubeMaster = void 0;
class YoutubeMaster {
    constructor() {
        this.name = 'youtube';
        this.displayName = 'YouTube';
        this.icon = {
            name: 'youtube',
            color: 'red'
        };
        this.fieldsDefintion = {
            id: {
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
    }
    normalizeFields(fields) {
        if (typeof fields === 'string') {
            fields = { id: fields };
        }
        else if (typeof fields === 'number') {
            fields = { id: fields.toString() };
        }
        return fields;
    }
    collectOptionalMediaUris(fields) {
        return this.convertYoutubeIdToUri(fields.id);
    }
    convertYoutubeIdToUri(youtubeId) {
        return `ref:YT_${youtubeId}`;
    }
}
exports.YoutubeMaster = YoutubeMaster;
