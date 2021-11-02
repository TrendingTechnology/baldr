"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SampleListMaster = void 0;
const master_1 = require("../master");
class SampleListMaster extends master_1.Master {
    constructor() {
        super(...arguments);
        this.name = 'sampleList';
        this.displayName = 'Audio-Ausschnitte';
        this.icon = {
            name: 'music',
            color: 'red'
        };
        this.fieldsDefintion = {
            samples: {
                type: Array,
                required: true,
                description: 'Eine Liste von Audio-Ausschnitten.'
            },
            heading: {
                type: String,
                markup: true,
                description: 'Überschrift der Ausschnitte.',
                required: false
            },
            notNumbered: {
                type: Boolean,
                description: 'Nicht durchnummeriert'
            }
        };
    }
}
exports.SampleListMaster = SampleListMaster;
