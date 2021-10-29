import { Master } from './_types';
export class QuoteMaster extends Master {
    constructor() {
        super(...arguments);
        this.name = 'quote';
        this.displayName = 'Zitat';
    }
}
