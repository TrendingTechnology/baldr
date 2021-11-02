import { Master } from '../master';
export declare class ScoreSampleMaster implements Master {
    name: string;
    displayName: string;
    icon: {
        name: string;
        color: string;
    };
    fieldsDefintion: {
        heading: {
            type: StringConstructor;
            description: string;
            markup: boolean;
        };
        score: {
            type: StringConstructor;
            description: string;
            assetUri: boolean;
            required: boolean;
        };
        audio: {
            type: StringConstructor;
            description: string;
            assetUri: boolean;
        };
    };
}
