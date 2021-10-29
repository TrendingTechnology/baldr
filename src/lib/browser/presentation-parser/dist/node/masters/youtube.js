"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YoutubeMaster = void 0;
const _types_1 = require("./_types");
class YoutubeMaster extends _types_1.Master {
    constructor() {
        super(...arguments);
        this.name = 'youtube';
        this.displayName = 'YouTube';
    }
}
exports.YoutubeMaster = YoutubeMaster;
