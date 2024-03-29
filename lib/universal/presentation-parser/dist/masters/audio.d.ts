import { MasterSpec, Resolver, Asset, Sample } from '../master-specification';
export declare type AudioFieldsRaw = string | AudioFieldsNormalized;
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
export declare class AudioMaster implements MasterSpec {
    name: string;
    displayName: string;
    icon: {
        name: string;
        color: string;
        /**
         *  U+1F50A
         *
         * @see https://emojipedia.org/speaker-high-volume/
         */
        unicodeSymbol: string;
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
    shortFormField: string;
    collectMediaUris(fields: AudioFieldsNormalized): Set<string>;
    collectFieldsAfterResolution(fields: AudioFieldsNormalized, resolver: Resolver): AudioFieldsResolved;
}
export {};
