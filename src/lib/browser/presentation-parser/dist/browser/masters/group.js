import { Master } from './_types';
export class GroupMaster extends Master {
    constructor() {
        super(...arguments);
        this.name = 'group';
        this.displayName = 'Gruppe';
    }
}
