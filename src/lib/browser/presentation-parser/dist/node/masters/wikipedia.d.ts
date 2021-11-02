import { Master } from '../master';
export declare class WikipediaMaster extends Master {
    name: string;
    displayName: string;
    icon: {
        name: string;
        color: string;
    };
    fieldsDefintion: {
        title: {
            type: StringConstructor;
            required: boolean;
            description: string;
        };
        language: {
            type: StringConstructor;
            description: string;
            default: string;
        };
        oldid: {
            type: NumberConstructor;
            description: string;
        };
    };
}
