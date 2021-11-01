import { Master } from '../master';
interface FieldData {
    personId: string;
}
declare type RawFieldData = string | FieldData;
export declare class PersonMaster extends Master {
    name: string;
    displayName: string;
    iconSpec: {
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
    protected collectMediaUris(fields: FieldData): string;
    private convertPersonIdToMediaUri;
}
export {};
