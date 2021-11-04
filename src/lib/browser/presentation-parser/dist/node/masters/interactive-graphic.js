"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InteractiveGraphicMaster = void 0;
class InteractiveGraphicMaster {
    constructor() {
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
    normalizeFields(fields) {
        if (typeof fields === 'string') {
            fields = { src: fields };
        }
        if (fields.stepSelector == null) {
            fields.stepSelector = 'g[inkscape\\:groupmode="layer"]';
        }
        return fields;
    }
    collectMediaUris(fields) {
        return fields.src;
    }
}
exports.InteractiveGraphicMaster = InteractiveGraphicMaster;
