export class WebsiteMaster {
    constructor() {
        this.name = 'website';
        this.displayName = 'Website';
        this.icon = {
            name: 'master-website',
            color: 'blue',
            /**
             * U+1F310
             *
             * @see https://emojipedia.org/globe-with-meridians/
             */
            unicodeSymbol: '🌐'
        };
        this.fieldsDefintion = {
            url: {
                type: String,
                required: true,
                description: 'Die URL der Website, die angezeigt werden soll.'
            }
        };
        this.shortFormField = 'url';
    }
}
