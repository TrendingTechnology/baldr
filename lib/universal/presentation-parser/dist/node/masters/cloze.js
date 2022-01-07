"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClozeMaster = void 0;
const client_media_models_1 = require("@bldr/client-media-models");
const master_specification_1 = require("../master-specification");
class ClozeMaster {
    constructor() {
        this.name = 'cloze';
        this.displayName = 'Lückentext';
        this.icon = {
            name: 'cloze',
            color: 'blue',
            /**
             * U+1F5DB
             *
             * @see https://emojipedia.org/decrease-font-size-symbol/
             */
            unicodeSymbol: '🗛'
        };
        this.fieldsDefintion = Object.assign({ src: {
                type: String,
                required: true,
                description: 'Den URI zu einer SVG-Datei, die den Lückentext enthält.',
                assetUri: true
            } }, (0, master_specification_1.mapStepFieldDefintions)(['subset']));
    }
    normalizeFieldsInput(fields) {
        if (typeof fields === 'string') {
            fields = { src: fields };
        }
        const uri = new client_media_models_1.MediaUri(fields.src);
        if (uri.fragment != null) {
            if (fields.stepSubset == null) {
                fields.stepSubset = uri.fragment;
            }
            fields.src = uri.uriWithoutFragment;
        }
        return fields;
    }
    collectMediaUris(props) {
        return props.src;
    }
}
exports.ClozeMaster = ClozeMaster;
