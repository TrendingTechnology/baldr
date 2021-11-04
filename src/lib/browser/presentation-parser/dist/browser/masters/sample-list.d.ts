import { Master } from '../master';
declare type SampleListFieldsRaw = string | SampleListFieldsNormalized;
interface SampleListFieldsNormalized {
    samples: string | string[];
}
export declare class SampleListMaster implements Master {
    name: string;
    displayName: string;
    icon: {
        name: string;
        color: string;
    };
    fieldsDefintion: {
        samples: {
            type: ArrayConstructor;
            required: boolean;
            description: string;
        };
        heading: {
            type: StringConstructor;
            markup: boolean;
            description: string;
            required: boolean;
        };
        notNumbered: {
            type: BooleanConstructor;
            description: string;
        };
    };
    normalizeFields(fields: SampleListFieldsRaw): SampleListFieldsNormalized;
}
export {};
