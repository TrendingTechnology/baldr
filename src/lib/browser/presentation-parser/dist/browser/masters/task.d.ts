import { Master } from '../master';
declare type TaskFieldsRaw = string | TaskFieldsNormalized;
interface TaskFieldsNormalized {
    markup: string;
}
export declare class TaskMaster implements Master {
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
    normalizeFields(fields: TaskFieldsRaw): TaskFieldsNormalized;
}
export {};
