import { Master } from '../master';
export class QuoteMaster extends Master {
    constructor() {
        super(...arguments);
        this.name = 'quote';
        this.displayName = 'Zitat';
    }
}
