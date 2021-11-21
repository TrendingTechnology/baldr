"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SampleListMaster = void 0;
const master_1 = require("../master");
class SampleListMaster {
    constructor() {
        this.name = 'sampleList';
        this.displayName = 'Audio-Ausschnitte';
        this.icon = {
            name: 'music',
            color: 'red',
            /**
             * U+1F501
             *
             * @see https://emojipedia.org/repeat-button/
             */
            unicodeSymbol: '🔁'
        };
        this.fieldsDefintion = {
            samples: {
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
    normalizeFieldsInput(fields) {
        let samples;
        if (typeof fields === 'string' || Array.isArray(fields)) {
            samples = fields;
            fields = { samples: [] };
        }
        else {
            samples = fields.samples;
        }
        const wrappedUris = new master_1.WrappedUriList(samples);
        fields.samples = wrappedUris.list;
        return fields;
    }
    collectMediaUris(fields) {
        return master_1.extractUrisFromFuzzySpecs(fields.samples);
    }
    collectFieldsAfterResolution(fields, resolver) {
        if (fields.samples.length === 1) {
            const asset = resolver.getAsset(fields.samples[0].uri);
            if (asset.samples != null) {
                const uriList = [];
                for (const sample of asset.samples.getAll()) {
                    uriList.push({ uri: sample.ref, title: sample.titleSafe });
                }
                fields.samples = uriList;
            }
        }
        return fields;
    }
    collectStepsAfterResolution(fields, slide) {
        for (const wrappedUri of fields.samples) {
            const title = wrappedUri.title != null ? wrappedUri.title : wrappedUri.uri;
            slide.stepCollector.add(title);
        }
    }
}
exports.SampleListMaster = SampleListMaster;
