import { Master } from '../master';
export declare class InteractiveGraphicMaster extends Master {
    name: string;
    displayName: string;
    icon: {
        name: string;
        color: string;
        showOnSlides: boolean;
    };
    fieldsDefintion: {
        src: {
            type: StringConstructor;
            required: boolean;
            description: string;
            assetUri: boolean;
        };
    };
}
