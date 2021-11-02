"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CounterMaster = void 0;
class CounterMaster {
    constructor() {
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
exports.CounterMaster = CounterMaster;
