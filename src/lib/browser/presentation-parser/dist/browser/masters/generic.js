const CHARACTERS_ON_SLIDE = 400;
export class GenericMaster {
    constructor() {
        this.name = 'generic';
        this.displayName = 'Folie';
        this.icon = {
            name: 'file-presentation-box',
            color: 'gray',
            showOnSlides: false
        };
        this.fieldsDefintion = {
            markup: {
                type: [String, Array],
                required: true,
                // It is complicated to convert to prop based markup conversion.
                // markup: true
                inlineMarkup: true,
                description: 'Markup im HTML oder Markdown-Format'
            },
            charactersOnSlide: {
                type: Number,
                description: 'Gibt an wie viele Zeichen auf einer Folie erscheinen sollen.',
                default: CHARACTERS_ON_SLIDE
            },
            onOne: {
                description: 'Der ganze Text erscheint auf einer Folien. Keine automatischen Folienumbrüche.',
                type: Boolean,
                default: false
            }
        };
    }
    normalizeFieldsInput(fields) {
        if (typeof fields === 'string' || Array.isArray(fields)) {
            fields = {
                markup: fields
            };
        }
        return fields;
    }
}
