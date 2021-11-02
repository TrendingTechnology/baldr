import { Master } from '../master';
export declare class CounterMaster extends Master {
    name: string;
    displayName: string;
    icon: {
        name: string;
        color: string;
        size: "large";
    };
    fieldsDefintion: {
        to: {
            type: NumberConstructor;
            required: boolean;
            description: string;
        };
        format: {
            default: string;
            description: string;
        };
    };
}
