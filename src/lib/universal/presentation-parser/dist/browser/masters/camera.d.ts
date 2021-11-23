import { Master } from '../master';
export declare class CameraMaster implements Master {
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
