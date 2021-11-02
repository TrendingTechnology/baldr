"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClozeMaster = void 0;
const master_1 = require("../master");
class ClozeMaster extends master_1.Master {
    constructor() {
        super(...arguments);
        this.name = 'cloze';
        this.displayName = 'Lückentext';
        this.icon = {
            name: 'cloze',
            color: 'blue'
        };
        this.fieldsDefintion = {
            src: {
                type: String,
                required: true,
                description: 'Den URI zu einer SVG-Datei, die den Lückentext enthält.',
                assetUri: true
            }
        };
    }
}
exports.ClozeMaster = ClozeMaster;
