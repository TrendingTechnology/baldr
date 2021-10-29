"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CameraMaster = void 0;
const _types_1 = require("./_types");
class CameraMaster extends _types_1.Master {
    constructor() {
        super(...arguments);
        this.name = 'camera';
        this.displayName = 'Dokumentenkamera';
    }
}
exports.CameraMaster = CameraMaster;
