import { Master } from '../master';
export declare class SampleListMaster extends Master {
    name: string;
    displayName: string;
    icon: {
        name: string;
        color: string;
    };
    fieldsDefintion: {
        samples: {
            type: ArrayConstructor;
            required: boolean;
            description: string;
        };
        heading: {
            type: StringConstructor;
            markup: boolean;
            description: string;
            required: boolean;
        };
        notNumbered: {
            type: BooleanConstructor;
            description: string;
        };
    };
}
