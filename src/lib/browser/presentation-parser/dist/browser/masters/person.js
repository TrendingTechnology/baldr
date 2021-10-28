import { Master } from '../master';
export class PersonMaster extends Master {
    constructor() {
        super(...arguments);
        this.name = 'person';
        this.displayName = 'Porträt';
        this.fieldsDefintion = {
            personId: {
                type: String,
                description: 'Personen-ID (z. B. Beethoven_Ludwig-van).'
            }
        };
    }
    normalizeFields(props) {
        if (typeof props === 'string') {
            return {
                personId: props
            };
        }
        return props;
    }
}
