import { Master } from '../master';
declare type WikipediaFieldsRaw = string | WikipediaFieldsNormalized;
interface WikipediaFieldsNormalized {
    title: string;
    language: string;
    oldid?: number;
}
export declare class WikipediaMaster implements Master {
    name: string;
    displayName: string;
    icon: {
        name: string;
        color: string;
    };
    fieldsDefintion: {
        title: {
            type: StringConstructor;
            required: boolean;
            description: string;
        };
        language: {
            type: StringConstructor;
            description: string;
            default: string;
        };
        oldid: {
            type: NumberConstructor;
            description: string;
        };
    };
    normalizeFields(fields: WikipediaFieldsRaw): WikipediaFieldsNormalized;
}
export {};
