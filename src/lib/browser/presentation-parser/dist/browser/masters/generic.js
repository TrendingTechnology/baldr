import { Master } from '../master';
export class GenericMaster extends Master {
    constructor() {
        super(...arguments);
        this.name = 'generic';
        this.displayName = 'Folie';
        this.iconSpec = {
            name: 'file-presentation-box',
            color: 'gray',
            showOnSlides: false
        };
    }
}
