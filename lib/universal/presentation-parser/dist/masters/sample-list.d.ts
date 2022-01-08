import { MasterSpec, WrappedUri, Resolver, Slide } from '../master-specification';
declare type SampleListFieldsRaw = string | string[] | SampleListFieldsNormalized;
interface SampleListFieldsNormalized {
    samples: WrappedUri[];
    heading?: string;
    notNumbered?: boolean;
}
export declare class SampleListMaster implements MasterSpec {
    name: string;
    displayName: string;
    icon: {
        name: string;
        color: string;
        /**
         * U+1F501
         *
         * @see https://emojipedia.org/repeat-button/
         */
        unicodeSymbol: string;
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
    normalizeFieldsInput(fields: SampleListFieldsRaw): SampleListFieldsNormalized;
    collectMediaUris(fields: SampleListFieldsNormalized): Set<string>;
    collectFieldsAfterResolution(fields: SampleListFieldsNormalized, resolver: Resolver): SampleListFieldsNormalized;
    collectStepsAfterResolution(fields: SampleListFieldsNormalized, slide: Slide): void;
}
export {};
