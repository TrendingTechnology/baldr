export class DocumentMaster {
    name = 'document';
    displayName = 'Dokument';
    icon = {
        name: 'file-outline',
        color: 'gray',
        /**
         * U+1F4D1
         *
         * @see https://emojipedia.org/bookmark-tabs/
         */
        unicodeSymbol: '📑'
    };
    fieldsDefintion = {
        src: {
            type: String,
            description: 'URI eines Dokuments.'
        },
        page: {
            type: Number,
            description: 'Nur eine Seite des PDFs anzeigen'
        }
    };
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
