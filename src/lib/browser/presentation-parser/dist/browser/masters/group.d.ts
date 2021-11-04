import { Master } from '../master';
declare type GroupFieldsRaw = string;
interface GroupFieldsNormalized {
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
    normalizeFields(fields: GroupFieldsRaw): GroupFieldsNormalized;
    collectMediaUris(fields: GroupFieldsNormalized): string;
    private convertGroupIdToMediaId;
}
export {};
