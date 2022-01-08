export function convertPersonIdToMediaUri(personId) {
    return `ref:PR_${personId}`;
}
export class PersonMaster {
    name = 'person';
    displayName = 'Porträt';
    icon = {
        name: 'person',
        color: 'orange',
        /**
         *  U+1F9D1
         *
         * @see https://emojipedia.org/person/
         */
        unicodeSymbol: '🧑'
    };
    fieldsDefintion = {
        personId: {
            type: String,
            description: 'Personen-ID (z. B. Beethoven_Ludwig-van).'
        }
    };
    shortFormField = 'personId';
    collectMediaUris(fields) {
        return convertPersonIdToMediaUri(fields.personId);
    }
}
