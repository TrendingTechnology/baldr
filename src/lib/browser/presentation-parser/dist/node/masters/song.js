"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SongMaster = void 0;
const master_1 = require("../master");
class SongMaster extends master_1.Master {
    constructor() {
        super(...arguments);
        this.name = 'song';
        this.displayName = 'Lied';
    }
}
exports.SongMaster = SongMaster;
