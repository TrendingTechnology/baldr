import { Master } from '../master';
declare type GenericFieldsRawInput = string | string[] | GenericFieldsInput;
interface GenericFieldsInput {
    markup: string | string[];
    charactersOnSlide?: number;
    onOne?: boolean;
}
interface GenericFieldsInstantiated extends GenericFieldsInput {
    markup: string[];
    charactersOnSlide: number;
    onOne: boolean;
}
export declare function splitMarkup(rawMarkup: string | string[], charactersOnSlide: number): string[];
export declare class GenericMaster implements Master {
    name: string;
    displayName: string;
    icon: {
        name: string;
        color: string;
        showOnSlides: boolean;
        /**
         * U+1F4C4
         *
         * @see https://emojipedia.org/page-facing-up/
         */
        unicodeSymbol: string;
    };
    fieldsDefintion: {
        markup: {
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
    normalizeFieldsInput(fields: GenericFieldsRawInput): GenericFieldsInput;
    collectFieldsOnInstantiation(fields: GenericFieldsInstantiated): GenericFieldsInstantiated;
}
export {};
