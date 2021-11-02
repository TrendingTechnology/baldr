import { Master } from '../master';
export declare class QuoteMaster extends Master {
    name: string;
    displayName: string;
    icon: {
        name: string;
        color: string;
        size: "large";
    };
    fieldsDefintion: {
        text: {
            type: StringConstructor;
            required: boolean;
            markup: boolean;
            description: string;
        };
        author: {
            type: StringConstructor;
            description: string;
        };
        date: {
            type: (StringConstructor | NumberConstructor)[];
            description: string;
        };
        source: {
            type: StringConstructor;
            markup: boolean;
            description: string;
        };
        prolog: {
            type: StringConstructor;
            markup: boolean;
            description: string;
        };
        epilog: {
            type: StringConstructor;
            markup: boolean;
            description: string;
        };
    };
}
