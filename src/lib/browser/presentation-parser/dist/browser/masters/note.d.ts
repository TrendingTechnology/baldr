import { Master } from '../master';
export declare class NoteMaster implements Master {
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
        items: {
            type: ArrayConstructor;
        };
        sections: {
            type: ArrayConstructor;
        };
    };
}
