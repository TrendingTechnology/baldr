import { MasterSpec } from '../master-specification';
declare type QuoteFieldsRaw = string | QuoteFieldsNormalized;
interface QuoteFieldsNormalized {
    text: string;
    author?: string;
    date?: string;
    source?: string;
    prolog?: string;
    epilog?: string;
}
export declare class QuoteMaster implements MasterSpec {
    name: string;
    displayName: string;
    icon: {
        name: string;
        color: string;
        size: "large";
        /**
         * U+1F4AC
         *
         * @see https://emojipedia.org/speech-balloon/
         */
        unicodeSymbol: string;
    };
    fieldsDefintion: {
        text: {
            type: StringConstructor;
            required: boolean;
            markup: boolean;
            description: string;
        };
        author: {
            type: StringConstructor;
            description: string;
        };
        date: {
            type: (StringConstructor | NumberConstructor)[];
            description: string;
        };
        source: {
            type: StringConstructor;
            markup: boolean;
            description: string;
        };
        prolog: {
            type: StringConstructor;
            markup: boolean;
            description: string;
        };
        epilog: {
            type: StringConstructor;
            markup: boolean;
            description: string;
        };
    };
    normalizeFieldsInput(fields: QuoteFieldsRaw): QuoteFieldsNormalized;
}
export {};
