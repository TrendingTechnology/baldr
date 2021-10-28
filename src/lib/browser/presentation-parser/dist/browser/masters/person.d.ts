import { Master } from '../master';
interface FieldData {
    personId: string;
}
declare type RawFieldData = string | FieldData;
export declare class PersonMaster extends Master {
    name: string;
    displayName: string;
    fieldsDefintion: {
        personId: {
            type: StringConstructor;
            description: string;
        };
    };
    normalizeFields(props: RawFieldData): FieldData;
}
export {};
