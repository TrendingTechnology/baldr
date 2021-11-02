import { Master } from '../master';
export class QuoteMaster extends Master {
    constructor() {
        super(...arguments);
        this.name = 'quote';
        this.displayName = 'Zitat';
        this.icon = {
            name: 'quote',
            color: 'brown',
            size: 'large'
        };
        this.fieldsDefintion = {
            text: {
                type: String,
                required: true,
                markup: true,
                description: 'Haupttext des Zitats.'
            },
            author: {
                type: String,
                description: 'Der Autor des Zitats.'
            },
            date: {
                type: [String, Number],
                description: 'Datum des Zitats.'
            },
            source: {
                type: String,
                markup: true,
                description: 'Die Quelle des Zitats'
            },
            prolog: {
                type: String,
                markup: true,
                description: 'Längerer Text, der vor dem Zitat erscheint.'
            },
            epilog: {
                type: String,
                markup: true,
                description: 'Längerer Text, der nach dem Zitat erscheint.'
            }
        };
    }
}
