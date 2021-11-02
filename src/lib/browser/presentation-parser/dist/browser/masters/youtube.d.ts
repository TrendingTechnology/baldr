import { Master } from '../master';
interface FieldData {
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
    normalizeFields(fields: any): FieldData;
    collectOptionalMediaUris(fields: FieldData): string | string[] | Set<string> | undefined;
    private convertYoutubeIdToUri;
}
export {};
