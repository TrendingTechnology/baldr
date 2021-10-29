import { Master } from './_types';
export class DocumentMaster extends Master {
    constructor() {
        super(...arguments);
        this.name = 'document';
        this.displayName = 'Dokument';
    }
}
