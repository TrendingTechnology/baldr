import { Master } from '../master';
export class TaskMaster extends Master {
    constructor() {
        super(...arguments);
        this.name = 'task';
        this.displayName = 'Arbeitsauftrag';
        this.icon = {
            name: 'task',
            color: 'yellow-dark',
            size: 'large'
        };
    }
}
