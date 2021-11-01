"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoMaster = void 0;
const master_1 = require("../master");
class VideoMaster extends master_1.Master {
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
exports.VideoMaster = VideoMaster;
