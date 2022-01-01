import { MasterSpec } from '../master-specification';
declare type ClozeFieldsRaw = string | ClozeFieldsNormalized;
interface ClozeFieldsNormalized {
    src: string;
    stepSubset?: string;
}
export declare class ClozeMaster implements MasterSpec {
    name: string;
    displayName: string;
    icon: {
        name: string;
        color: string;
        /**
         * U+1F5DB
         *
         * @see https://emojipedia.org/decrease-font-size-symbol/
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
    };
    normalizeFieldsInput(fields: ClozeFieldsRaw): ClozeFieldsNormalized;
    collectMediaUris(props: ClozeFieldsNormalized): string;
}
export {};
