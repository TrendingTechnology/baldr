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
        this.fieldsDefintion = {
            src: {
                type: String,
                required: true,
                description: 'Den URI zu einer Video-Datei.',
                assetUri: true
            },
            showMeta: {
                type: Boolean,
                description: 'Zeige Metainformationen'
            }
        };
    }
}
exports.VideoMaster = VideoMaster;
