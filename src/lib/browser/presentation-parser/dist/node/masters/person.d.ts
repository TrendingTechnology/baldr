import { Master } from '../master';
interface FieldData {
    personId: string;
}
declare type RawFieldData = string | FieldData;
export declare class PersonMaster implements Master {
    name: string;
    displayName: string;
    icon: {
        name: string;
        color: string;
    };
    fieldsDefintion: {
        personId: {
            type: StringConstructor;
            description: string;
        };
    };
    normalizeFields(fields: RawFieldData): FieldData;
    collectMediaUris(fields: FieldData): string;
    private convertPersonIdToMediaUri;
}
export {};
