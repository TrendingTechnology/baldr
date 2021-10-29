import { Master } from './_types';
export class InteractiveGraphicMaster extends Master {
    constructor() {
        super(...arguments);
        this.name = 'interactiveGraphic';
        this.displayName = 'Interaktive Grafik';
    }
}
