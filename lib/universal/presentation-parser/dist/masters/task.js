export class TaskMaster {
    constructor() {
        this.name = 'task';
        this.displayName = 'Arbeitsauftrag';
        this.icon = {
            name: 'master-task',
            color: 'yellow-dark',
            size: 'large',
            /**
             * U+2757
             *
             * @see https://emojipedia.org/exclamation-mark/
             */
            unicodeSymbol: '❗'
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
    normalizeFieldsInput(fields) {
        if (typeof fields === 'string') {
            fields = {
                markup: fields
            };
        }
        return fields;
    }
}
