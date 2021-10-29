import { Master } from '../master';
export class InstrumentMaster extends Master {
    constructor() {
        super(...arguments);
        this.name = 'instrument';
        this.displayName = 'Instrument';
    }
}
