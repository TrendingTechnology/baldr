import { Master } from '../master';
export class DocumentMaster extends Master {
    constructor() {
        super(...arguments);
        this.name = 'document';
        this.displayName = 'Dokument';
        this.icon = {
            name: 'file-outline',
            color: 'gray'
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
}
