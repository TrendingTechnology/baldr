import { MasterSpec } from '../master-specification';
export declare class WebsiteMaster implements MasterSpec {
    name: string;
    displayName: string;
    icon: {
        name: string;
        color: string;
        /**
         * U+1F310
         *
         * @see https://emojipedia.org/globe-with-meridians/
         */
        unicodeSymbol: string;
    };
    fieldsDefintion: {
        url: {
            type: StringConstructor;
            required: boolean;
            description: string;
        };
    };
    shortFormField: string;
}
