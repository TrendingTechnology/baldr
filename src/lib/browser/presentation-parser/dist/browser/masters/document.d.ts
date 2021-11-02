import { Master } from '../master';
export declare class DocumentMaster extends Master {
    name: string;
    displayName: string;
    icon: {
        name: string;
        color: string;
    };
    fieldsDefintion: {
        src: {
            type: StringConstructor;
            description: string;
        };
        page: {
            type: NumberConstructor;
            description: string;
        };
    };
}
