import { Master } from '../master';
export class EditorMaster extends Master {
    constructor() {
        super(...arguments);
        this.name = 'editor';
        this.displayName = 'Hefteintrag';
        this.icon = {
            name: 'pencil',
            color: 'blue'
        };
        this.fieldsDefintion = {
            markup: {
                type: String,
                markup: true,
                description: 'Text im HTML oder Markdown Format oder natürlich als reiner Text.'
            }
        };
    }
}
