import { Master } from '../master';
export class SongMaster extends Master {
    constructor() {
        super(...arguments);
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
