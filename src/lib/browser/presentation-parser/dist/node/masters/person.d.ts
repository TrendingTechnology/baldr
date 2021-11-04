import { Master } from '../master';
declare type PersonFieldsRaw = string | PersonFieldsNormalized;
interface PersonFieldsNormalized {
    personId: string;
}
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
    normalizeFields(fields: PersonFieldsRaw): PersonFieldsNormalized;
    collectMediaUris(fields: PersonFieldsNormalized): string;
    private convertPersonIdToMediaUri;
}
export {};
