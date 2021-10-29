"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AudioMaster = void 0;
const _types_1 = require("./_types");
class AudioMaster extends _types_1.Master {
    constructor() {
        super(...arguments);
        this.name = 'audio';
        this.displayName = 'Hörbeispiel';
    }
}
exports.AudioMaster = AudioMaster;
