export class ImageMaster {
    constructor() {
        this.name = 'image';
        this.displayName = 'Bild';
        this.icon = {
            name: 'image',
            color: 'green'
        };
        this.fieldsDefintion = {
            src: {
                type: String,
                required: true,
                description: 'Den URI zu einer Bild-Datei.',
                assetUri: true
            },
            title: {
                type: String,
                markup: true,
                description: 'Ein Titel, der angezeigt wird.'
            },
            description: {
                type: String,
                markup: true,
                description: 'Eine Beschreibung, die angezeigt wird.'
            },
            noMeta: {
                type: Boolean,
                description: 'Beeinflusst, ob Metainformation wie z. B. Titel oder Beschreibung angezeigt werden sollen.',
                default: false
            }
        };
    }
    normalizeFields(fields) {
        if (typeof fields === 'string') {
            fields = { src: fields };
        }
        return fields;
    }
    collectMediaUris(fields) {
        return fields.src;
    }
}
