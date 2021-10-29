import { Master } from './_types';
export class SectionMaster extends Master {
    constructor() {
        super(...arguments);
        this.name = 'section';
        this.displayName = 'Abschnitt';
    }
}
