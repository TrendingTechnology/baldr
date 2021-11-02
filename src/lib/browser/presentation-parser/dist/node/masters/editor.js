"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditorMaster = void 0;
class EditorMaster {
    constructor() {
        this.name = 'editor';
        this.displayName = 'Hefteintrag';
        this.icon = {
            name: 'pencil',
            color: 'blue'
        };
        this.fieldsDefintion = {
            markup: {
                type: String,
                markup: true,
                description: 'Text im HTML oder Markdown Format oder natürlich als reiner Text.'
            }
        };
    }
}
exports.EditorMaster = EditorMaster;
