"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SectionMaster = void 0;
const master_1 = require("../master");
class SectionMaster {
    constructor() {
        this.name = 'section';
        this.displayName = 'Abschnitt';
        this.icon = {
            name: 'file-tree',
            color: 'orange-dark',
            /**
             * U+2796
             *
             * @see https://emojipedia.org/minus/
             */
            unicodeSymbol: '➖'
        };
        this.fieldsDefintion = {
            heading: {
                type: String,
                required: true,
                markup: true,
                description: 'Die Überschrift / der Titel des Abschnitts.'
            }
        };
        this.shortFormField = 'heading';
    }
    deriveTitleFromFields(fields) {
        return master_1.shortenText(fields.heading);
    }
}
exports.SectionMaster = SectionMaster;
