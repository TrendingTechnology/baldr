import { shortenText } from '../master-specification';
export class SectionMaster {
    name = 'section';
    displayName = 'Abschnitt';
    icon = {
        name: 'file-tree',
        color: 'orange-dark',
        /**
         * U+2796
         *
         * @see https://emojipedia.org/minus/
         */
        unicodeSymbol: '➖'
    };
    fieldsDefintion = {
        heading: {
            type: String,
            required: true,
            markup: true,
            description: 'Die Überschrift / der Titel des Abschnitts.'
        }
    };
    shortFormField = 'heading';
    deriveTitleFromFields(fields) {
        return shortenText(fields.heading);
    }
}
