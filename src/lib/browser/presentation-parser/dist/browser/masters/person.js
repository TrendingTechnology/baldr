export class PersonMaster {
    constructor() {
        this.name = 'person';
        this.displayName = 'Porträt';
        this.icon = {
            name: 'person',
            color: 'orange'
        };
        this.fieldsDefintion = {
            personId: {
                type: String,
                description: 'Personen-ID (z. B. Beethoven_Ludwig-van).'
            }
        };
    }
    normalizeFields(fields) {
        if (typeof fields === 'string') {
            return {
                personId: fields
            };
        }
        return fields;
    }
    collectMediaUris(fields) {
        return this.convertPersonIdToMediaUri(fields.personId);
    }
    convertPersonIdToMediaUri(personId) {
        return `ref:PR_${personId}`;
    }
}
