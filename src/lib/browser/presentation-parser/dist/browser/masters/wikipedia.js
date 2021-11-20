const DEFAULT_LANGUAGE = 'de';
export class WikipediaMaster {
    constructor() {
        this.name = 'wikipedia';
        this.displayName = 'Wikipedia';
        this.icon = {
            name: 'wikipedia',
            color: 'black'
        };
        this.fieldsDefintion = {
            title: {
                type: String,
                required: true,
                description: 'Der Titel des Wikipedia-Artikels (z. B. „Ludwig_van_Beethoven“).'
            },
            language: {
                type: String,
                description: 'Der Sprachen-Code des gewünschten Wikipedia-Artikels (z. B. „de“, „en“).',
                default: DEFAULT_LANGUAGE
            },
            oldid: {
                type: Number,
                description: 'Eine alte Version verwenden.'
            }
        };
    }
    normalizeFieldsInput(fields) {
        if (typeof fields === 'string') {
            // de:Wolfgang_Amadeus_Mozart
            const regExp = new RegExp(/^([a-z]+):(.+)$/);
            const match = fields.match(regExp);
            if (match) {
                fields = {
                    title: match[2],
                    language: match[1]
                };
            }
            else {
                // Wolfgang_Amadeus_Mozart
                fields = { title: fields, language: DEFAULT_LANGUAGE };
            }
        }
        return fields;
    }
}
