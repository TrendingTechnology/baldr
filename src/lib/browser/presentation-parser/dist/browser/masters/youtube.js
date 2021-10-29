import { Master } from './_types';
export class YoutubeMaster extends Master {
    constructor() {
        super(...arguments);
        this.name = 'youtube';
        this.displayName = 'YouTube';
    }
}
