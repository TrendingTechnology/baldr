import { Master } from './_types';
export class EditorMaster extends Master {
    constructor() {
        super(...arguments);
        this.name = 'editor';
        this.displayName = 'Hefteintrag';
    }
}
