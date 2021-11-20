import { Master } from '../master';
declare type InstrumentFieldsRaw = string | InstrumentFieldsNormalized;
interface InstrumentFieldsNormalized {
    instrumentId: string;
}
export declare class InstrumentMaster implements Master {
    name: string;
    displayName: string;
    icon: {
        name: string;
        color: string;
    };
    fieldsDefintion: {
        instrumentId: {
            type: StringConstructor;
            description: string;
        };
    };
    normalizeFieldsInput(fields: InstrumentFieldsRaw): InstrumentFieldsNormalized;
    resolveMediaUris(fields: InstrumentFieldsNormalized): string;
    private convertInstrumentIdToMediaId;
}
export {};
