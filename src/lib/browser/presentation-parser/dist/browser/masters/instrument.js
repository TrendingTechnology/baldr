import { Master } from './_types';
export class InstrumentMaster extends Master {
    constructor() {
        super(...arguments);
        this.name = 'instrument';
        this.displayName = 'Instrument';
    }
}
