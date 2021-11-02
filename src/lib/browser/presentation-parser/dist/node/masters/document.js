"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentMaster = void 0;
const master_1 = require("../master");
class DocumentMaster extends master_1.Master {
    constructor() {
        super(...arguments);
        this.name = 'document';
        this.displayName = 'Dokument';
        this.icon = {
            name: 'file-outline',
            color: 'gray'
        };
        this.fieldsDefintion = {
            src: {
                type: String,
                description: 'URI eines Dokuments.'
            },
            page: {
                type: Number,
                description: 'Nur eine Seite des PDFs anzeigen'
            }
        };
    }
}
exports.DocumentMaster = DocumentMaster;
