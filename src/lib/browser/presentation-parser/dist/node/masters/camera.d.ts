import { Master } from '../master';
export declare class CameraMaster implements Master {
    name: string;
    displayName: string;
    icon: {
        name: string;
        color: string;
    };
    fieldsDefintion: {};
    normalizeFields(fields: any): any;
}
