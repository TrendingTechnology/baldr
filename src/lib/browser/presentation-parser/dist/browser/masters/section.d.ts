import { Master } from '../master';
export declare type SectionFieldsRaw = string | SectionFieldsNormalized;
interface SectionFieldsNormalized {
    heading: string;
}
export declare class SectionMaster implements Master {
    name: string;
    displayName: string;
    icon: {
        name: string;
        color: string;
        /**
         * U+2796
         *
         * @see https://emojipedia.org/minus/
         */
        unicodeSymbol: string;
    };
    fieldsDefintion: {
        heading: {
            type: StringConstructor;
            required: boolean;
            markup: boolean;
            description: string;
        };
    };
    shortFormField: string;
    deriveTitleFromFields(fields: SectionFieldsNormalized): string;
}
export {};
