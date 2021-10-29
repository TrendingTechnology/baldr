"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YoutubeMaster = void 0;
const master_1 = require("../master");
class YoutubeMaster extends master_1.Master {
    constructor() {
        super(...arguments);
        this.name = 'youtube';
        this.displayName = 'YouTube';
    }
}
exports.YoutubeMaster = YoutubeMaster;
