import { Master } from '../master';
export declare class TaskMaster extends Master {
    name: string;
    displayName: string;
    icon: {
        name: string;
        color: string;
        size: "large";
    };
    fieldsDefintion: {
        markup: {
            type: StringConstructor;
            required: boolean;
            markup: boolean;
            description: string;
        };
    };
}
