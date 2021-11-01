import { Master } from '../master';
export class ClozeMaster extends Master {
    constructor() {
        super(...arguments);
        this.name = 'cloze';
        this.displayName = 'Lückentext';
        this.icon = {
            name: 'cloze',
            color: 'blue'
        };
    }
}
