"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoteMaster = void 0;
const master_1 = require("../master");
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
            }
        };
    }
    normalizeFields(fields) {
        if (typeof fields === 'string') {
            fields = {
                markup: fields
            };
        }
        fields.markup = master_1.convertMarkdownToHtml(fields.markup);
        // hr tag
        if (fields.markup.indexOf('<hr>') > -1) {
            const segments = fields.markup.split('<hr>');
            const prolog = segments.shift();
            let body = segments.join('<hr>');
            body = '<span class="word-area">' + master_1.wrapWords(body) + '</span>';
            fields.markup = [prolog, body].join('');
            // No hr tag provided
            // Step through all words
        }
        else {
            fields.markup = master_1.wrapWords(fields.markup);
        }
        return fields;
    }
}
exports.NoteMaster = NoteMaster;
