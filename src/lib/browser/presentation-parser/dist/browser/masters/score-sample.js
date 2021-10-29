import { Master } from './_types';
export class ScoreSampleMaster extends Master {
    constructor() {
        super(...arguments);
        this.name = 'scoreSample';
        this.displayName = 'Notenbeispiel';
    }
}
