export class InstrumentMaster {
    name = 'instrument';
    displayName = 'Instrument';
    icon = {
        name: 'instrument',
        color: 'yellow',
        /**
         * U+1F3BA
         *
         * @see https://emojipedia.org/trumpet/
         */
        unicodeSymbol: '🎺'
    };
    fieldsDefintion = {
        instrumentId: {
            type: String,
            description: 'Die ID des Instruments. Gleichlautend wie der Ordner in dem alle Medieninhalte liegen (z. B. Floete)'
        }
    };
    normalizeFieldsInput(fields) {
        if (typeof fields === 'string') {
            fields = {
                instrumentId: fields
            };
        }
        return fields;
    }
    resolveMediaUris(fields) {
        return this.convertInstrumentIdToMediaId(fields.instrumentId);
    }
    convertInstrumentIdToMediaId(instrumentId) {
        return `ref:IN_${instrumentId}`;
    }
}
