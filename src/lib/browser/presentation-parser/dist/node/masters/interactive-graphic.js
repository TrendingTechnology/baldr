"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InteractiveGraphicMaster = void 0;
const master_1 = require("../master");
class InteractiveGraphicMaster extends master_1.Master {
    constructor() {
        super(...arguments);
        this.name = 'interactiveGraphic';
        this.displayName = 'Interaktive Grafik';
        this.icon = {
            name: 'image',
            color: 'blue',
            showOnSlides: false
        };
        this.fieldsDefintion = {
            src: {
                type: String,
                required: true,
                description: 'Den URI zu einer SVG-Datei.',
                assetUri: true
            }
        };
    }
}
exports.InteractiveGraphicMaster = InteractiveGraphicMaster;
