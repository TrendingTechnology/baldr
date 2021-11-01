"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CameraMaster = void 0;
const master_1 = require("../master");
class CameraMaster extends master_1.Master {
    constructor() {
        super(...arguments);
        this.name = 'camera';
        this.displayName = 'Dokumentenkamera';
        this.iconSpec = {
            name: 'document-camera',
            color: 'red'
        };
    }
}
exports.CameraMaster = CameraMaster;
