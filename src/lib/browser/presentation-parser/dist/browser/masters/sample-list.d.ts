import { Master, WrappedUri, Resolver } from '../master';
declare type SampleListFieldsRaw = string | string[] | SampleListFieldsNormalized;
interface SampleListFieldsNormalized {
    samples: WrappedUri[];
    heading?: string;
    notNumbered?: boolean;
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
    collectFields(fields: SampleListFieldsNormalized, resolver: Resolver): SampleListFieldsNormalized;
    collectMediaUris(fields: SampleListFieldsNormalized): Set<string>;
}
export {};
