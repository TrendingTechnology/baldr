import { Master } from '../master';
interface FieldData {
    src: string;
    title?: string;
    description?: string;
    noMeta?: boolean;
}
export declare class ImageMaster extends Master {
    name: string;
    displayName: string;
    iconSpec: {
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
        description: {
            type: StringConstructor;
            markup: boolean;
            description: string;
        };
        noMeta: {
            type: BooleanConstructor;
            description: string;
            default: boolean;
        };
    };
    normalizeFields(fields: any): FieldData;
    protected collectMediaUris(fields: FieldData): string;
}
export {};
