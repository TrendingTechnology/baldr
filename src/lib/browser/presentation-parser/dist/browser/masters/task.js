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
        this.fieldsDefintion = {
            markup: {
                type: String,
                required: true,
                markup: true,
                description: 'Text im HTML oder Markdown-Format oder als reinen Text.'
            }
        };
    }
}
