"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersonMaster = exports.convertPersonIdToMediaUri = void 0;
function convertPersonIdToMediaUri(personId) {
    return `ref:PR_${personId}`;
}
exports.convertPersonIdToMediaUri = convertPersonIdToMediaUri;
class PersonMaster {
    constructor() {
        this.name = 'person';
        this.displayName = 'Porträt';
        this.icon = {
            name: 'person',
            color: 'orange',
            /**
             *  U+1F9D1
             *
             * @see https://emojipedia.org/person/
             */
            unicodeSymbol: '🧑'
        };
        this.fieldsDefintion = {
            personId: {
                type: String,
                description: 'Personen-ID (z. B. Beethoven_Ludwig-van).'
            }
        };
        this.shortFormField = 'personId';
    }
    collectMediaUris(fields) {
        return convertPersonIdToMediaUri(fields.personId);
    }
}
exports.PersonMaster = PersonMaster;
