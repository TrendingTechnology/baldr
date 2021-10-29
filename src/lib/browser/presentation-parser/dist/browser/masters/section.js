import { Master } from '../master';
export class SectionMaster extends Master {
    constructor() {
        super(...arguments);
        this.name = 'section';
        this.displayName = 'Abschnitt';
    }
}
