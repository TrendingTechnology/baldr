import { Master } from '../master';
export class ScoreSampleMaster extends Master {
    constructor() {
        super(...arguments);
        this.name = 'scoreSample';
        this.displayName = 'Notenbeispiel';
        this.iconSpec = {
            name: 'file-audio',
            color: 'black'
        };
    }
}
