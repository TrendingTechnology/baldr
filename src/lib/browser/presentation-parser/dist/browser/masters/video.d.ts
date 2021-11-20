import { Master } from '../master';
declare type VideoFieldsRaw = string | VideoFieldsNormalized;
interface VideoFieldsNormalized {
    src: string;
}
export declare class VideoMaster implements Master {
    name: string;
    displayName: string;
    icon: {
        name: string;
        color: string;
        /**
         * @see https://emojipedia.org/film-projector/
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
        showMeta: {
            type: BooleanConstructor;
            description: string;
        };
    };
    normalizeFieldsInput(fields: VideoFieldsRaw): VideoFieldsNormalized;
    collectMediaUris(fields: VideoFieldsNormalized): string;
}
export {};
