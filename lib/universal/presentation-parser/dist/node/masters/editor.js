"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditorMaster = void 0;
const master_specification_1 = require("../master-specification");
class EditorMaster {
    constructor() {
        this.name = 'editor';
        this.displayName = 'Hefteintrag';
        this.icon = {
            name: 'pencil',
            color: 'blue',
            /**
             * U+1F4DD
             *
             * @see https://emojipedia.org/memo/
             */
            unicodeSymbol: '📝'
        };
        this.fieldsDefintion = Object.assign({ markup: {
                type: String,
                markup: true,
                description: 'Text im HTML oder Markdown Format oder natürlich als reiner Text.'
            } }, (0, master_specification_1.mapStepFieldDefintions)(['mode', 'subset']));
    }
    normalizeFieldsInput(fields) {
        if (typeof fields === 'string') {
            fields = {
                markup: fields
            };
        }
        return fields;
    }
}
exports.EditorMaster = EditorMaster;
