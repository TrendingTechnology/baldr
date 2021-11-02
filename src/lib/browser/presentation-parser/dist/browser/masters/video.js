export class VideoMaster {
    constructor() {
        this.name = 'video';
        this.displayName = 'Video';
        this.icon = {
            name: 'video-vintage',
            color: 'purple'
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
}
