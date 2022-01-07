"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InteractiveGraphicMaster = void 0;
const master_specification_1 = require("../master-specification");
class InteractiveGraphicMaster {
    constructor() {
        this.name = 'interactiveGraphic';
        this.displayName = 'Interaktive Grafik';
        this.description = 'Diese Master-Folie ist dazu gedacht, mit *Inkscape* erstellte SVG-Dateien darzustellen.';
        this.icon = {
            name: 'image',
            color: 'blue',
            showOnSlides: false,
            /**
             * U+1F4CA
             *
             * @see https://emojipedia.org/bar-chart/
             */
            unicodeSymbol: '📊'
        };
        this.fieldsDefintion = Object.assign({ src: {
                type: String,
                required: true,
                description: 'Den URI zu einer SVG-Datei.',
                assetUri: true
            }, mode: {
                description: 'layer (Inkscape-Ebenen), layer+ (Elemente der Inkscape-Ebenen), group (Gruppierungen)',
                default: 'layer',
                validate: (input) => {
                    return ['layer', 'layer+', 'group'].includes(input);
                }
            } }, (0, master_specification_1.mapStepFieldDefintions)(['selector', 'subset']));
    }
    normalizeFieldsInput(fields) {
        if (typeof fields === 'string') {
            fields = { src: fields };
        }
        return fields;
    }
    collectMediaUris(fields) {
        return fields.src;
    }
}
exports.InteractiveGraphicMaster = InteractiveGraphicMaster;
