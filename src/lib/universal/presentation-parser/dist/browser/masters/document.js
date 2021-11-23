export class DocumentMaster {
    constructor() {
        this.name = 'document';
        this.displayName = 'Dokument';
        this.icon = {
            name: 'file-outline',
            color: 'gray',
            /**
             * U+1F4D1
             *
             * @see https://emojipedia.org/bookmark-tabs/
             */
            unicodeSymbol: '📑'
        };
        this.fieldsDefintion = {
            src: {
                type: String,
                description: 'URI eines Dokuments.'
            },
            page: {
                type: Number,
                description: 'Nur eine Seite des PDFs anzeigen'
            }
        };
    }
    normalizeFieldsInput(fields) {
        if (typeof fields === 'string') {
            fields = {
                src: fields
            };
        }
        return fields;
    }
    collectMediaUris(fields) {
        return fields.src;
    }
}
