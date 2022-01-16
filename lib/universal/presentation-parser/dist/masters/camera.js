export class CameraMaster {
    constructor() {
        this.name = 'camera';
        this.displayName = 'Dokumentenkamera';
        this.icon = {
            name: 'master-camera',
            color: 'red',
            /**
             * U+1F4F7
             *
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
