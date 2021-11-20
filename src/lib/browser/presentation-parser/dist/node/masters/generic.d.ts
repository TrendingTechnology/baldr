import { Master } from '../master';
declare type GenericFieldsRaw = string | GenericFieldsNormalized;
interface GenericFieldsNormalized {
    markup: string | string[];
}
export declare class GenericMaster implements Master {
    name: string;
    displayName: string;
    icon: {
        name: string;
        color: string;
        showOnSlides: boolean;
    };
    fieldsDefintion: {
        markup: {
            type: (StringConstructor | ArrayConstructor)[];
            required: boolean;
            inlineMarkup: boolean;
            description: string;
        };
        charactersOnSlide: {
            type: NumberConstructor;
            description: string;
            default: number;
        };
        onOne: {
            description: string;
            type: BooleanConstructor;
            default: boolean;
        };
    };
    normalizeFieldsInput(fields: GenericFieldsRaw): GenericFieldsNormalized;
}
export {};
