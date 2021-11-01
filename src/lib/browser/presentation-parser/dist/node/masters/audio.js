"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AudioMaster = void 0;
const master_1 = require("../master");
class AudioMaster extends master_1.Master {
    constructor() {
        super(...arguments);
        this.name = 'audio';
        this.displayName = 'Hörbeispiel';
        this.iconSpec = {
            name: 'music',
            color: 'brown'
        };
    }
}
exports.AudioMaster = AudioMaster;
