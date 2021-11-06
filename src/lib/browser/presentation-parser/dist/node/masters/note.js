"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoteMaster = void 0;
class NoteMaster {
    constructor() {
        this.name = 'note';
        this.displayName = 'Hefteintrag';
        this.icon = {
            name: 'pencil',
            color: 'blue'
        };
        this.fieldsDefintion = {
            markup: {
                type: String,
                markup: true,
                description: 'Text im HTML- oder Markdown-Format oder als reiner Text.'
            },
            items: {
                type: Array
            },
            sections: {
                type: Array
            }
        };
    }
    normalizeFields(fields) {
        if (typeof fields === 'string') {
            fields = {
                markup: fields
            };
        }
        return fields;
    }
}
exports.NoteMaster = NoteMaster;
