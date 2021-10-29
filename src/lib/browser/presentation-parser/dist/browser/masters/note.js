import { Master } from './_types';
export class NoteMaster extends Master {
    constructor() {
        super(...arguments);
        this.name = 'note';
        this.displayName = 'Hefteintrag';
    }
}
