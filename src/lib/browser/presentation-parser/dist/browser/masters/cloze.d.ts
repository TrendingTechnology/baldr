import { Master } from '../master';
declare type ClozeFieldsRaw = string | ClozeFieldsNormalized;
interface ClozeFieldsNormalized {
    src: string;
    stepSubset?: string;
}
export declare class ClozeMaster implements Master {
    name: string;
    displayName: string;
    icon: {
        name: string;
        color: string;
    };
    fieldsDefintion: {
        src: {
            type: StringConstructor;
            required: boolean;
            description: string;
            assetUri: boolean;
        };
    };
    normalizeFields(fields: ClozeFieldsRaw): ClozeFieldsNormalized;
    collectMediaUris(props: ClozeFieldsNormalized): string;
}
export {};
