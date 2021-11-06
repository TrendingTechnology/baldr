export class EditorMaster {
    constructor() {
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
    normalizeFields(fields) {
        if (typeof fields === 'string') {
            fields = {
                markup: fields
            };
        }
        return fields;
    }
}
