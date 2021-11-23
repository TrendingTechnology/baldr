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
        /**
         * U+1F3BA
         *
         * @see https://emojipedia.org/trumpet/
         */
        unicodeSymbol: string;
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
