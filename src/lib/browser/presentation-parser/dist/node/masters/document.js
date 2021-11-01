"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentMaster = void 0;
const master_1 = require("../master");
class DocumentMaster extends master_1.Master {
    constructor() {
        super(...arguments);
        this.name = 'document';
        this.displayName = 'Dokument';
        this.iconSpec = {
            name: 'file-outline',
            color: 'gray'
        };
    }
}
exports.DocumentMaster = DocumentMaster;
