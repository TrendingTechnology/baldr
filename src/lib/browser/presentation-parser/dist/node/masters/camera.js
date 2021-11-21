"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CameraMaster = void 0;
class CameraMaster {
    constructor() {
        this.name = 'camera';
        this.displayName = 'Dokumentenkamera';
        this.icon = {
            name: 'document-camera',
            color: 'red',
            /**
             * U+1F4F7
             *
             * @see https://emojipedia.org/camera/
             */
            unicodeSymbol: '📷'
        };
        this.fieldsDefintion = {};
    }
    normalizeFieldsInput(fields) {
        return {};
    }
}
exports.CameraMaster = CameraMaster;
