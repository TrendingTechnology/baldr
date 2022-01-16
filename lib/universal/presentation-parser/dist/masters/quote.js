export class QuoteMaster {
    constructor() {
        this.name = 'quote';
        this.displayName = 'Zitat';
        this.icon = {
            name: 'master-quote',
            color: 'brown',
            size: 'large',
            /**
             * U+1F4AC
             *
             * @see https://emojipedia.org/speech-balloon/
             */
            unicodeSymbol: '💬'
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
    normalizeFieldsInput(fields) {
        if (typeof fields === 'string') {
            fields = {
                text: fields
            };
        }
        // Inject quotations marks after the first before the last word character
        // <p><span class="quotation-mark">»</span>Quote
        fields.text = fields.text.replace(/^(\s*<.+>)?/, '$1<span class="quotation-mark">»</span> ');
        fields.text = fields.text.replace(/(<.+>\s*)?$/, ' <span class="quotation-mark">«</span>$1');
        return fields;
    }
}
