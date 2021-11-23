import { Master } from '../master';
declare type InteractiveGraphicFieldsRaw = string | InteractiveGraphicFieldsNormalized;
interface InteractiveGraphicFieldsNormalized {
    src: string;
    stepSelector: string;
}
export declare class InteractiveGraphicMaster implements Master {
    name: string;
    displayName: string;
    icon: {
        name: string;
        color: string;
        showOnSlides: boolean;
        /**
         * U+1F4CA
         *
         * @see https://emojipedia.org/bar-chart/
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
        mode: {
            description: string;
            default: string;
            validate: (input: any) => boolean;
        };
    };
    normalizeFieldsInput(fields: InteractiveGraphicFieldsRaw): InteractiveGraphicFieldsNormalized;
    collectMediaUris(fields: InteractiveGraphicFieldsNormalized): string;
}
export {};
