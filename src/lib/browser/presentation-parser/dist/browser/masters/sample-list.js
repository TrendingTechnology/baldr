import { Master } from './_types';
export class SampleListMaster extends Master {
    constructor() {
        super(...arguments);
        this.name = 'sampleList';
        this.displayName = 'Audio-Ausschnitte';
    }
}
