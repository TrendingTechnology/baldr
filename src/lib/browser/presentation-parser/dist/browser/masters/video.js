import { Master } from '../master';
export class VideoMaster extends Master {
    constructor() {
        super(...arguments);
        this.name = 'video';
        this.displayName = 'Video';
        this.iconSpec = {
            name: 'video-vintage',
            color: 'purple'
        };
    }
}
