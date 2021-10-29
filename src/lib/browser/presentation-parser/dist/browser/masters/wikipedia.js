import { Master } from '../master';
export class WikipediaMaster extends Master {
    constructor() {
        super(...arguments);
        this.name = 'wikipedia';
        this.displayName = 'Wikipedia';
    }
}
