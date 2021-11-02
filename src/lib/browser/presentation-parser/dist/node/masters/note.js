"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoteMaster = void 0;
const master_1 = require("../master");
class NoteMaster extends master_1.Master {
    constructor() {
        super(...arguments);
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
}
exports.NoteMaster = NoteMaster;
