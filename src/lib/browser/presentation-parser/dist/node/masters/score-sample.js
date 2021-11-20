"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScoreSampleMaster = void 0;
class ScoreSampleMaster {
    constructor() {
        this.name = 'scoreSample';
        this.displayName = 'Notenbeispiel';
        this.icon = {
            name: 'file-audio',
            color: 'black'
        };
        this.fieldsDefintion = {
            heading: {
                type: String,
                description: 'Eine Überschrift',
                markup: true
            },
            score: {
                type: String,
                description: 'URI zu einer Bild-Datei, dem Notenbeispiel.',
                assetUri: true,
                required: true
            },
            audio: {
                type: String,
                description: 'URI der entsprechenden Audio-Datei oder des Samples.',
                assetUri: true
            }
        };
    }
    normalizeFieldsInput(fields) {
        if (typeof fields === 'string') {
            fields = {
                score: fields
            };
        }
        return fields;
    }
    collectMediaUris(fields) {
        const uris = new Set([fields.score]);
        if (fields.audio != null) {
            uris.add(fields.audio);
        }
        return uris;
    }
}
exports.ScoreSampleMaster = ScoreSampleMaster;
