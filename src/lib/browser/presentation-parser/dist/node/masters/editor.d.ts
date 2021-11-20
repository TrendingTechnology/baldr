import { Master } from '../master';
declare type EditorFieldsRaw = string | EditorFieldsNormalized;
interface EditorFieldsNormalized {
    markup: string;
}
export declare class EditorMaster implements Master {
    name: string;
    displayName: string;
    icon: {
        name: string;
        color: string;
    };
    fieldsDefintion: {
        markup: {
            type: StringConstructor;
            markup: boolean;
            description: string;
        };
    };
    normalizeFieldsInput(fields: EditorFieldsRaw): EditorFieldsNormalized;
}
export {};
