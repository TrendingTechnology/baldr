import { Master } from '../master';
export class NoteMaster extends Master {
    constructor() {
        super(...arguments);
        this.name = 'note';
        this.displayName = 'Hefteintrag';
    }
}
