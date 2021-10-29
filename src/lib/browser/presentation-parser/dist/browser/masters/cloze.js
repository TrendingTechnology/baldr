import { Master } from './_types';
export class ClozeMaster extends Master {
    constructor() {
        super(...arguments);
        this.name = 'cloze';
        this.displayName = 'Lückentext';
    }
}
