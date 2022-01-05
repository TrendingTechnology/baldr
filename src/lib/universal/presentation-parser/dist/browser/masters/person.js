export function convertPersonIdToMediaUri(personId) {
    return `ref:PR_${personId}`;
}
export class PersonMaster {
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
