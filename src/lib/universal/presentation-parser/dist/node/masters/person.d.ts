import { MasterSpec } from '../master-specification';
export declare type PersonFieldsRaw = string | PersonFieldsNormalized;
interface PersonFieldsNormalized {
    personId: string;
}
export declare class PersonMaster implements MasterSpec {
    name: string;
    displayName: string;
    icon: {
        name: string;
        color: string;
        /**
         *  U+1F9D1
         *
         * @see https://emojipedia.org/person/
         */
        unicodeSymbol: string;
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
