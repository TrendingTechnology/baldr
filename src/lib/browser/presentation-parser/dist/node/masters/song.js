"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SongMaster = void 0;
const _types_1 = require("./_types");
class SongMaster extends _types_1.Master {
    constructor() {
        super(...arguments);
        this.name = 'song';
        this.displayName = 'Lied';
    }
}
exports.SongMaster = SongMaster;
