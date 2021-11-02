import { Master } from '../master';
export declare class EditorMaster extends Master {
    name: string;
    displayName: string;
    icon: {
        name: string;
        color: string;
    };
    fieldsDefintion: {
        markup: {
            type: StringConstructor;
            markup: boolean;
            description: string;
        };
    };
}
