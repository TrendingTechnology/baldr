export class CameraMaster {
    constructor() {
        this.name = 'camera';
        this.displayName = 'Dokumentenkamera';
        this.icon = {
            name: 'document-camera',
            color: 'red',
            /**
             * @see https://emojipedia.org/camera/
             */
            unicodeSymbol: '📷'
        };
        this.fieldsDefintion = {};
    }
    normalizeFieldsInput(fields) {
        return {};
    }
}
