import { Master } from './_types';
export class TaskMaster extends Master {
    constructor() {
        super(...arguments);
        this.name = 'task';
        this.displayName = 'Arbeitsauftrag';
    }
}
