import { Master } from '../master';
export declare class VideoMaster extends Master {
    name: string;
    displayName: string;
    icon: {
        name: string;
        color: string;
    };
    fieldsDefintion: {
        src: {
            type: StringConstructor;
            required: boolean;
            description: string;
            assetUri: boolean;
        };
        showMeta: {
            type: BooleanConstructor;
            description: string;
        };
    };
}
