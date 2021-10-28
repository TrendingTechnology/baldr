"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersonMaster = void 0;
const master_1 = require("../master");
class PersonMaster extends master_1.Master {
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
exports.PersonMaster = PersonMaster;
