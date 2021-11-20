import { Master } from '../master';
declare type SectionFieldsRaw = string | SectionFieldsNormalized;
interface SectionFieldsNormalized {
    heading: string;
}
export declare class SectionMaster implements Master {
    name: string;
    displayName: string;
    icon: {
        name: string;
        color: string;
    };
    fieldsDefintion: {
        heading: {
            type: StringConstructor;
            required: boolean;
            markup: boolean;
            description: string;
        };
    };
    normalizeFieldsInput(fields: SectionFieldsRaw): SectionFieldsNormalized;
}
export {};
