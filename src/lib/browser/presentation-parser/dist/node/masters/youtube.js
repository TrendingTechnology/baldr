"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YoutubeMaster = void 0;
const master_1 = require("../master");
class YoutubeMaster extends master_1.Master {
    constructor() {
        super(...arguments);
        this.name = 'youtube';
        this.displayName = 'YouTube';
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
