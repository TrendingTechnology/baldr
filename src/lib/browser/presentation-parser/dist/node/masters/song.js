"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SongMaster = void 0;
class SongMaster {
    constructor() {
        this.name = 'song';
        this.displayName = 'Lied';
        this.icon = {
            name: 'file-song',
            color: 'green',
            /**
             * U+1F3BC
             *
             * @see https://emojipedia.org/musical-score/
             */
            unicodeSymbol: '🎼'
        };
        this.fieldsDefintion = {
            songId: {
                type: String,
                description: 'Die ID des Liedes'
            }
        };
    }
    normalizeFieldsInput(fields) {
        if (typeof fields === 'string') {
            fields = { songId: fields };
        }
        return fields;
    }
    collectMediaUris(fields) {
        return this.convertSongIdToRef(fields.songId);
    }
    convertSongIdToRef(songId) {
        return `ref:LD_${songId}`;
    }
}
exports.SongMaster = SongMaster;
