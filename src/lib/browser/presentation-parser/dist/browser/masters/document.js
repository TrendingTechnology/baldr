import { Master } from '../master';
export class DocumentMaster extends Master {
    constructor() {
        super(...arguments);
        this.name = 'document';
        this.displayName = 'Dokument';
        this.iconSpec = {
            name: 'file-outline',
            color: 'gray'
        };
    }
}
