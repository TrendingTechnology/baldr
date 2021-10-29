import { Master } from './_types';
export class GenericMaster extends Master {
    constructor() {
        super(...arguments);
        this.name = 'generic';
        this.displayName = 'Folie';
    }
}
