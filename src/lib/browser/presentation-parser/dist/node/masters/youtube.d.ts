import { Master } from '../master';
interface FieldData {
    id: string;
    heading?: string;
    info?: string;
}
export declare class YoutubeMaster extends Master {
    name: string;
    displayName: string;
    iconSpec: {
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
    protected collectOptionalMediaUris(fields: FieldData): string;
    private convertYoutubeIdToUri;
}
export {};
