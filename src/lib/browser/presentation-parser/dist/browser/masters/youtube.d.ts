import { Master } from '../master';
declare type YoutubeFieldsRaw = number | string | YoutubeFieldNormalized;
interface YoutubeFieldNormalized {
    id: string;
    heading?: string;
    info?: string;
}
export declare class YoutubeMaster implements Master {
    name: string;
    displayName: string;
    icon: {
        name: string;
        color: string;
    };
    fieldsDefintion: {
        id: {
            type: StringConstructor;
            required: boolean;
            description: string;
        };
        heading: {
            type: StringConstructor;
            description: string;
            markup: boolean;
        };
        info: {
            type: StringConstructor;
            description: string;
            markup: boolean;
        };
    };
    normalizeFields(fields: YoutubeFieldsRaw): YoutubeFieldNormalized;
    collectOptionalMediaUris(fields: YoutubeFieldNormalized): string | string[] | Set<string> | undefined;
    private convertYoutubeIdToUri;
}
export {};
