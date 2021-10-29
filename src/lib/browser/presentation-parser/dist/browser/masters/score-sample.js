import { Master } from '../master';
export class ScoreSampleMaster extends Master {
    constructor() {
        super(...arguments);
        this.name = 'scoreSample';
        this.displayName = 'Notenbeispiel';
    }
}
