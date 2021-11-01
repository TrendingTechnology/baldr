import { Master } from '../master';
export class VideoMaster extends Master {
    constructor() {
        super(...arguments);
        this.name = 'video';
        this.displayName = 'Video';
        this.icon = {
            name: 'video-vintage',
            color: 'purple'
        };
    }
}
