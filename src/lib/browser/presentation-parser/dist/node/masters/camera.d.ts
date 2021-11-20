import { Master } from '../master';
export declare class CameraMaster implements Master {
    name: string;
    displayName: string;
    icon: {
        name: string;
        color: string;
        /**
         * @see https://emojipedia.org/camera/
         */
        unicodeSymbol: string;
    };
    fieldsDefintion: {};
    normalizeFieldsInput(fields: any): any;
}
