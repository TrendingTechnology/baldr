import { Master, Resolver, Asset, Sample } from '../master';
declare type AudioFieldsRaw = string | AudioFieldsNormalized;
interface AudioFieldsNormalized {
    src: string;
    title?: string;
    composer?: string;
    artist?: string;
    partOf?: string;
    cover?: string;
    description?: string;
    autoplay?: boolean;
    playthrough?: boolean;
}
interface AudioFieldsResolved extends AudioFieldsNormalized {
    asset: Asset;
    sample: Sample;
    title: string;
    previewHttpUrl?: string;
}
export declare class AudioMaster implements Master {
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
        title: {
            type: StringConstructor;
            markup: boolean;
            description: string;
        };
        composer: {
            type: StringConstructor;
            markup: boolean;
            description: string;
        };
        artist: {
            type: StringConstructor;
            markup: boolean;
            description: string;
        };
        partOf: {
            type: StringConstructor;
            markup: boolean;
            description: string;
        };
        cover: {
            type: StringConstructor;
            description: string;
            assetUri: boolean;
        };
        description: {
            type: StringConstructor;
            markup: boolean;
            description: string;
        };
        autoplay: {
            type: BooleanConstructor;
            default: boolean;
            description: string;
        };
        playthrough: {
            type: BooleanConstructor;
            default: boolean;
            description: string;
        };
    };
    normalizeFields(fields: AudioFieldsRaw): AudioFieldsNormalized;
    collectMediaUris(fields: AudioFieldsNormalized): Set<string>;
    collectFields(fields: AudioFieldsNormalized, resolver: Resolver): AudioFieldsResolved;
}
export {};
