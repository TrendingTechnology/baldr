import { Master } from '../master';
export class NoteMaster extends Master {
    constructor() {
        super(...arguments);
        this.name = 'note';
        this.displayName = 'Hefteintrag';
        this.icon = {
            name: 'pencil',
            color: 'blue'
        };
        this.fieldsDefintion = {
            markup: {
                type: String,
                markup: true,
                description: 'Text im HTML- oder Markdown-Format oder als reiner Text.'
            },
            items: {
                type: Array
            },
            sections: {
                type: Array
            }
        };
    }
}
