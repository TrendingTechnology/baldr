export class SongMaster {
    constructor() {
        this.name = 'song';
        this.displayName = 'Lied';
        this.icon = {
            name: 'file-song',
            color: 'green'
        };
        this.fieldsDefintion = {
            songId: {
                type: String,
                description: 'Die ID des Liedes'
            }
        };
    }
    normalizeFields(fields) {
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
