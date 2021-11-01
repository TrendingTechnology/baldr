import { Master } from '../master';
export class AudioMaster extends Master {
    constructor() {
        super(...arguments);
        this.name = 'audio';
        this.displayName = 'Hörbeispiel';
        this.icon = {
            name: 'music',
            color: 'brown'
        };
    }
}
