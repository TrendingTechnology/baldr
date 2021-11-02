export class SongMaster {
    constructor() {
        this.name = 'song';
        this.displayName = 'Lied';
        this.icon = {
            name: 'file-audio',
            color: 'green'
        };
        this.fieldsDefintion = {
            songId: {
                type: String,
                description: 'Die ID des Liedes'
            }
        };
    }
}
