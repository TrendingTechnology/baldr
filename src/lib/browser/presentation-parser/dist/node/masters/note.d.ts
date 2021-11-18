import { Master } from '../master';
declare type NoteFieldsRaw = string | NoteFieldsNormalized;
interface NoteFieldsNormalized {
    markup: string;
}
export declare class NoteMaster implements Master {
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
    normalizeFields(fields: NoteFieldsRaw): NoteFieldsNormalized;
}
export {};
