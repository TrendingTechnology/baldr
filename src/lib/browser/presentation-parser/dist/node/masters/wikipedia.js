"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WikipediaMaster = void 0;
const DEFAULT_LANGUAGE = 'de';
class WikipediaMaster {
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
}
exports.WikipediaMaster = WikipediaMaster;
