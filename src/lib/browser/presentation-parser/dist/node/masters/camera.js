"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CameraMaster = void 0;
class CameraMaster {
    constructor() {
        this.name = 'camera';
        this.displayName = 'Dokumentenkamera';
        this.icon = {
            name: 'document-camera',
            color: 'red'
        };
        this.fieldsDefintion = {};
    }
    normalizeFieldsInput(fields) {
        return {};
    }
}
exports.CameraMaster = CameraMaster;
