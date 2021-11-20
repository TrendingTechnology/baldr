import { Master, StepCollector } from '../master';
export declare type NoteFieldsRaw = string | NoteFieldsInstantiated;
interface NoteFieldsInstantiated {
    markup: string;
}
export declare class NoteMaster implements Master {
    name: string;
    displayName: string;
    icon: {
        name: string;
        color: string;
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
