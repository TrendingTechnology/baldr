import { Master } from '../master';
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
}
