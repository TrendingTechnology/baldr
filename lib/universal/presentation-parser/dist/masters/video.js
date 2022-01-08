export class VideoMaster {
    name = 'video';
    displayName = 'Video';
    icon = {
        name: 'video-vintage',
        color: 'purple',
        /**
         * @see https://emojipedia.org/film-projector/
         */
        unicodeSymbol: '📽️'
    };
    fieldsDefintion = {
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
