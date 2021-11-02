import { Master } from '../master';
export class CounterMaster extends Master {
    constructor() {
        super(...arguments);
        this.name = 'counter';
        this.displayName = 'Zähler';
        this.icon = {
            name: 'counter',
            color: 'black',
            size: 'large'
        };
        this.fieldsDefintion = {
            to: {
                type: Number,
                required: true,
                description: 'Zähle bis zu dieser Zahl. In arabischen Zahlen angeben.'
            },
            format: {
                default: 'arabic',
                description: 'In welchem Format aufgezählt werden soll: arabic (arabische Zahlen), lower (Kleinbuchstaben), upper (Großbuchstaben), roman (Römische Zahlen).'
            }
        };
    }
}
