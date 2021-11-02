import { Master } from '../master';
const DEFAULT_LANGUAGE = 'de';
export class WikipediaMaster extends Master {
    constructor() {
        super(...arguments);
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
}
