import { Master } from '../master';
export class CameraMaster extends Master {
    constructor() {
        super(...arguments);
        this.name = 'camera';
        this.displayName = 'Dokumentenkamera';
    }
}
