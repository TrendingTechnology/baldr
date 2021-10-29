import { Master } from '../master';
export class GenericMaster extends Master {
    constructor() {
        super(...arguments);
        this.name = 'generic';
        this.displayName = 'Folie';
    }
}
