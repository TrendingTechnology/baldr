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
