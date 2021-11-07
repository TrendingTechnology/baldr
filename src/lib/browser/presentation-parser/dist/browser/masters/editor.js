import { mapStepFieldDefintions } from '../master';
export class EditorMaster {
    constructor() {
        this.name = 'editor';
        this.displayName = 'Hefteintrag';
        this.icon = {
            name: 'pencil',
            color: 'blue'
        };
        this.fieldsDefintion = Object.assign({ markup: {
                type: String,
                markup: true,
                description: 'Text im HTML oder Markdown Format oder natürlich als reiner Text.'
            } }, mapStepFieldDefintions(['mode', 'subset']));
    }
    normalizeFields(fields) {
        if (typeof fields === 'string') {
            fields = {
                markup: fields
            };
        }
        return fields;
    }
}
