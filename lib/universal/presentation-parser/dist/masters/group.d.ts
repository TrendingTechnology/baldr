import { MasterSpec } from '../master-specification';
export declare type GroupFieldsRaw = string | GroupFieldsNormalized;
export interface GroupFieldsNormalized {
    groupId: string;
}
export declare class GroupMaster implements MasterSpec {
    name: string;
    displayName: string;
    icon: {
        name: string;
        color: string;
        /**
         * U+1F93C
         *
         * @see https://emojipedia.org/people-wrestling/
         */
        unicodeSymbol: string;
    };
    fieldsDefintion: {
        groupId: {
            type: StringConstructor;
            required: boolean;
            description: string;
        };
    };
    shortFormField: string;
    collectMediaUris(fields: GroupFieldsNormalized): string;
    private convertGroupIdToMediaId;
}
