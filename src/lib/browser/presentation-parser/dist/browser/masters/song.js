import { Master } from '../master';
export class SongMaster extends Master {
    constructor() {
        super(...arguments);
        this.name = 'song';
        this.displayName = 'Lied';
        this.iconSpec = {
            name: 'file-audio',
            color: 'green'
        };
    }
}
