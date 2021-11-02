import { Master } from '../master';
export declare class InstrumentMaster implements Master {
    name: string;
    displayName: string;
    icon: {
        name: string;
        color: string;
    };
    fieldsDefintion: {
        instrumentId: {
            type: StringConstructor;
            description: string;
        };
    };
}
