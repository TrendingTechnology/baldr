"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditorMaster = void 0;
const master_1 = require("../master");
class EditorMaster extends master_1.Master {
    constructor() {
        super(...arguments);
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
