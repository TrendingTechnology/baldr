export class VideoMaster {
    constructor() {
        this.name = 'video';
        this.displayName = 'Video';
        this.icon = {
            name: 'video-vintage',
            color: 'purple',
            /**
             * @see https://emojipedia.org/film-projector/
             */
            unicodeSymbol: '📽️'
        };
        this.fieldsDefintion = {
            src: {
                type: String,
                required: true,
                description: 'Den URI zu einer Video-Datei.',
                assetUri: true
            },
            showMeta: {
                type: Boolean,
                description: 'Zeige Metainformationen'
            }
        };
    }
    normalizeFieldsInput(fields) {
        if (typeof fields === 'string') {
            fields = { src: fields };
        }
        return fields;
    }
    collectMediaUris(fields) {
        return fields.src;
    }
}
