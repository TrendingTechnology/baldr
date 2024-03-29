import { shortenText } from '../master-specification';
export class SectionMaster {
    constructor() {
        this.name = 'section';
        this.displayName = 'Abschnitt';
        this.icon = {
            name: 'master-section',
            color: 'orange-dark',
            /**
             * U+2796
             *
             * @see https://emojipedia.org/minus/
             */
            unicodeSymbol: '➖'
        };
        this.fieldsDefintion = {
            heading: {
                type: String,
                required: true,
                markup: true,
                description: 'Die Überschrift / der Titel des Abschnitts.'
            }
        };
        this.shortFormField = 'heading';
    }
    deriveTitleFromFields(fields) {
        return shortenText(fields.heading);
    }
}
