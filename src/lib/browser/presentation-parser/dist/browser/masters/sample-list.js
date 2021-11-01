import { Master } from '../master';
export class SampleListMaster extends Master {
    constructor() {
        super(...arguments);
        this.name = 'sampleList';
        this.displayName = 'Audio-Ausschnitte';
        this.icon = {
            name: 'music',
            color: 'red'
        };
    }
}
