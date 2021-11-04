"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SampleListMaster = void 0;
class SampleListMaster {
    constructor() {
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
        // collectionMediaUris (fields: SampleListFieldsNormalized) {
        //   return mediaResolver.getUrisFromWrappedSpecs(fields.samples)
        // }
    }
    normalizeFields(fields) {
        if (typeof fields === 'string' || Array.isArray(fields)) {
            fields = { samples: fields };
        }
        return fields;
    }
}
exports.SampleListMaster = SampleListMaster;
