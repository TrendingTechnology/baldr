import { Master } from './_types';
export class VideoMaster extends Master {
    constructor() {
        super(...arguments);
        this.name = 'video';
        this.displayName = 'Video';
    }
}
