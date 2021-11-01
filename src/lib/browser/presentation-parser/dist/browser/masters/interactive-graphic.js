import { Master } from '../master';
export class InteractiveGraphicMaster extends Master {
    constructor() {
        super(...arguments);
        this.name = 'interactiveGraphic';
        this.displayName = 'Interaktive Grafik';
        this.iconSpec = {
            name: 'image',
            color: 'blue',
            showOnSlides: false
        };
    }
}
