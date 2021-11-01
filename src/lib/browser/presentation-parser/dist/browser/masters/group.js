import { Master } from '../master';
export class GroupMaster extends Master {
    constructor() {
        super(...arguments);
        this.name = 'group';
        this.displayName = 'Gruppe';
        this.iconSpec = {
            name: 'account-group',
            color: 'orange'
        };
    }
}
