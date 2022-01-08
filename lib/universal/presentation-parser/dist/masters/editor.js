import { mapStepFieldDefintions } from '../master-specification';
export class EditorMaster {
    name = 'editor';
    displayName = 'Hefteintrag';
    icon = {
        name: 'pencil',
        color: 'blue',
        /**
         * U+1F4DD
         *
         * @see https://emojipedia.org/memo/
         */
        unicodeSymbol: '📝'
    };
    fieldsDefintion = {
        markup: {
            type: String,
            markup: true,
            description: 'Text im HTML oder Markdown Format oder natürlich als reiner Text.'
        },
        ...mapStepFieldDefintions(['mode', 'subset'])
    };
    normalizeFieldsInput(fields) {
        if (typeof fields === 'string') {
            fields = {
                markup: fields
            };
        }
        return fields;
    }
}
