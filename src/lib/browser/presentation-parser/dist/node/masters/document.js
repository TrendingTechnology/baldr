"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentMaster = void 0;
const _types_1 = require("./_types");
class DocumentMaster extends _types_1.Master {
    constructor() {
        super(...arguments);
        this.name = 'document';
        this.displayName = 'Dokument';
    }
}
exports.DocumentMaster = DocumentMaster;
