import { Master } from '../master';
interface AudioFieldData {
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
declare type RawFieldData = string | AudioFieldData;
export declare class AudioMaster extends Master {
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
            required: boolean;
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
    normalizeFields(fields: RawFieldData): AudioFieldData;
    resolveMediaUris(fields: AudioFieldData): Set<string>;
}
export {};
