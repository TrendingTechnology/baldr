import { Master } from '../master';
declare type MasterFieldsRaw = string | MasterFieldsNormalized;
interface MasterFieldsNormalized {
    src: string;
    title?: string;
    description?: string;
    noMeta?: boolean;
}
export declare class ImageMaster implements Master {
    name: string;
    displayName: string;
    icon: {
        name: string;
        color: string;
        /**
         * U+1F5BC U+FE0F
         * @see https://emojipedia.org/framed-picture/
         */
        unicodeSymbol: string;
    };
    fieldsDefintion: {
        src: {
            type: StringConstructor;
            required: boolean;
            description: string;
            assetUri: boolean;
        };
        title: {
            type: StringConstructor;
            markup: boolean;
            description: string;
        };
        description: {
            type: StringConstructor;
            markup: boolean;
            description: string;
        };
        noMeta: {
            type: BooleanConstructor;
            description: string;
            default: boolean;
        };
    };
    normalizeFieldsInput(fields: MasterFieldsRaw): MasterFieldsNormalized;
    collectMediaUris(fields: MasterFieldsNormalized): string;
}
export {};
