import { Master } from '../master';
export declare type PersonFieldsRaw = string | PersonFieldsNormalized;
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
    shortFormField: string;
    collectMediaUris(fields: PersonFieldsNormalized): string;
    private convertPersonIdToMediaUri;
}
export {};
