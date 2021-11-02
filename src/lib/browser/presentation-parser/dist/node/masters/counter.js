"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CounterMaster = void 0;
const master_1 = require("../master");
class CounterMaster extends master_1.Master {
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
exports.CounterMaster = CounterMaster;
