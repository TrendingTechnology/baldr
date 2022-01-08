import { mapStepFieldDefintions } from '../master-specification';
export class InteractiveGraphicMaster {
    name = 'interactiveGraphic';
    displayName = 'Interaktive Grafik';
    description = 'Diese Master-Folie ist dazu gedacht, mit *Inkscape* erstellte SVG-Dateien darzustellen.';
    icon = {
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
    fieldsDefintion = {
        src: {
            type: String,
            required: true,
            description: 'Den URI zu einer SVG-Datei.',
            assetUri: true
        },
        mode: {
            description: 'layer (Inkscape-Ebenen), layer+ (Elemente der Inkscape-Ebenen), group (Gruppierungen)',
            default: 'layer',
            validate: (input) => {
                return ['layer', 'layer+', 'group'].includes(input);
            }
        },
        ...mapStepFieldDefintions(['selector', 'subset'])
    };
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
