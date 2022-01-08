export class SongMaster {
    name = 'song';
    displayName = 'Lied';
    icon = {
        name: 'file-audio',
        color: 'green',
        /**
         * U+1F3BC
         *
         * @see https://emojipedia.org/musical-score/
         */
        unicodeSymbol: '🎼'
    };
    fieldsDefintion = {
        songId: {
            type: String,
            description: 'Die ID des Liedes'
        }
    };
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
