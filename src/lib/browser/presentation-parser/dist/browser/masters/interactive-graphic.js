import { mapStepFieldDefintions } from '../master';
export class InteractiveGraphicMaster {
    constructor() {
        this.name = 'interactiveGraphic';
        this.displayName = 'Interaktive Grafik';
        this.icon = {
            name: 'image',
            color: 'blue',
            showOnSlides: false
        };
        this.fieldsDefintion = Object.assign({ src: {
                type: String,
                required: true,
                description: 'Den URI zu einer SVG-Datei.',
                assetUri: true
            } }, mapStepFieldDefintions(['selector', 'subset']));
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
