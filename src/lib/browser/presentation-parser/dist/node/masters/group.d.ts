import { Master } from '../master';
export declare class GroupMaster extends Master {
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
