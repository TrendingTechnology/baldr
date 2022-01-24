import { MasterSpec, WrappedUri, Resolver, Slide, Sample } from '../master-specification';
declare type SampleListFieldsRaw = string | string[] | SampleListFields;
interface SampleListFields {
    samples: WrappedUri[];
    heading?: string;
    notNumbered?: boolean;
}
interface SampleListData {
    samples: Sample[];
}
export interface SampleListSlide extends Slide {
    fields: SampleListFields;
    data: SampleListData;
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
    normalizeFieldsInput(fields: SampleListFieldsRaw): SampleListFields;
    collectMediaUris(fields: SampleListFields): Set<string>;
    collectFieldsAfterResolution(fields: SampleListFields, resolver: Resolver): SampleListFields;
    collectStepsAfterResolution(fields: SampleListFields, slide: Slide): void;
}
export {};
