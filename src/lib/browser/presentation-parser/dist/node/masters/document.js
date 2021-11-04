"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentMaster = void 0;
class DocumentMaster {
    constructor() {
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
    normalizeFields(fields) {
        if (typeof fields === 'string') {
            fields = {
                src: fields
            };
        }
        return fields;
    }
    collectMediaUris(fields) {
        return fields.src;
    }
}
exports.DocumentMaster = DocumentMaster;
