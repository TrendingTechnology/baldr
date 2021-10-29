import { Master } from './_types';
export class AudioMaster extends Master {
    constructor() {
        super(...arguments);
        this.name = 'audio';
        this.displayName = 'Hörbeispiel';
    }
}
