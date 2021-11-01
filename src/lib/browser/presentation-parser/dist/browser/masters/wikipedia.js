import { Master } from '../master';
export class WikipediaMaster extends Master {
    constructor() {
        super(...arguments);
        this.name = 'wikipedia';
        this.displayName = 'Wikipedia';
        this.iconSpec = {
            name: 'wikipedia',
            color: 'black'
        };
    }
}
