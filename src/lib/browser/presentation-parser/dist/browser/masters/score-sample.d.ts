import { Master } from '../master';
declare type ScoreSampleFieldsRaw = string | ScoreSampleFieldsNormalized;
interface ScoreSampleFieldsNormalized {
    score: string;
    audio?: string;
}
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
    normalizeFields(fields: ScoreSampleFieldsRaw): ScoreSampleFieldsNormalized;
    collectMediaUris(fields: ScoreSampleFieldsNormalized): Set<string>;
}
export {};
