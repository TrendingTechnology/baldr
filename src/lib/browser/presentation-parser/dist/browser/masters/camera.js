import { Master } from './_types';
export class CameraMaster extends Master {
    constructor() {
        super(...arguments);
        this.name = 'camera';
        this.displayName = 'Dokumentenkamera';
    }
}
