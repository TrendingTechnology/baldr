import { Master } from '../master';
export declare type GroupFieldsRaw = string | GroupFieldsNormalized;
export interface GroupFieldsNormalized {
    groupId: string;
}
export declare class GroupMaster implements Master {
    name: string;
    displayName: string;
    icon: {
        name: string;
        color: string;
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
