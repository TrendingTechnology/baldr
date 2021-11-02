import { Master } from '../master';
export declare class SectionMaster extends Master {
    name: string;
    displayName: string;
    icon: {
        name: string;
        color: string;
    };
    fieldsDefintion: {
        heading: {
            type: StringConstructor;
            required: boolean;
            markup: boolean;
            description: string;
        };
    };
}
