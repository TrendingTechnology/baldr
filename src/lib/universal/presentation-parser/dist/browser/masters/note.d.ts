import { MasterSpec, StepCollector } from '../master-specification';
export declare type NoteFieldsRaw = string | NoteFieldsInstantiated;
interface NoteFieldsInstantiated {
    markup: string;
}
export declare class NoteMaster implements MasterSpec {
    name: string;
    displayName: string;
    icon: {
        name: string;
        color: string;
        /**
         * U+1F58B U+FE0F
         *
         * @see https://emojipedia.org/fountain-pen/
         */
        unicodeSymbol: string;
    };
    fieldsDefintion: {
        markup: {
            type: StringConstructor;
            markup: boolean;
            description: string;
        };
    };
    shortFormField: string;
    normalizeFieldsInput(fields: NoteFieldsInstantiated): NoteFieldsInstantiated;
    collectStepsOnInstantiation(fields: NoteFieldsInstantiated, stepCollector: StepCollector): void;
}
export {};
