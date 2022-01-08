import { MasterSpec } from '../master-specification';
export declare class CameraMaster implements MasterSpec {
    name: string;
    displayName: string;
    icon: {
        name: string;
        color: string;
        /**
         * U+1F4F7
         *
         * @see https://emojipedia.org/camera/
         */
        unicodeSymbol: string;
    };
    fieldsDefintion: {};
    normalizeFieldsInput(fields: any): any;
}
