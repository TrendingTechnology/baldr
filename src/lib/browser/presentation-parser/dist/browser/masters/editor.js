import { Master } from '../master';
export class EditorMaster extends Master {
    constructor() {
        super(...arguments);
        this.name = 'editor';
        this.displayName = 'Hefteintrag';
    }
}
