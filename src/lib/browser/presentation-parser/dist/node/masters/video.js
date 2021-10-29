"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoMaster = void 0;
const _types_1 = require("./_types");
class VideoMaster extends _types_1.Master {
    constructor() {
        super(...arguments);
        this.name = 'video';
        this.displayName = 'Video';
    }
}
exports.VideoMaster = VideoMaster;
