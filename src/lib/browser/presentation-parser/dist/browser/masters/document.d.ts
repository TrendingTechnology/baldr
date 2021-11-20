import { Master } from '../master';
declare type DocumentFieldsRaw = string | DocumentFieldsNormalized;
interface DocumentFieldsNormalized {
    src: string;
}
export declare class DocumentMaster implements Master {
    name: string;
    displayName: string;
    icon: {
        name: string;
        color: string;
        /**
         * U+1F5CB
         *
         * @see https://emojipedia.org/empty-document/
         */
        unicodeSymbol: string;
    };
    fieldsDefintion: {
        src: {
            type: StringConstructor;
            description: string;
        };
        page: {
            type: NumberConstructor;
            description: string;
        };
    };
    normalizeFieldsInput(fields: DocumentFieldsRaw): DocumentFieldsNormalized;
    collectMediaUris(fields: DocumentFieldsNormalized): string;
}
export {};
