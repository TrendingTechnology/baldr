import { Master } from './_types';
export class SongMaster extends Master {
    constructor() {
        super(...arguments);
        this.name = 'song';
        this.displayName = 'Lied';
    }
}
