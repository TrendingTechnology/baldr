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
    normalizeFields(fields: DocumentFieldsRaw): DocumentFieldsNormalized;
    collectMediaUris(fields: DocumentFieldsNormalized): string;
}
export {};
