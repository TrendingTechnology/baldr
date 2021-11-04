"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstrumentMaster = void 0;
class InstrumentMaster {
    constructor() {
        this.name = 'instrument';
        this.displayName = 'Instrument';
        this.icon = {
            name: 'instrument',
            color: 'yellow'
        };
        this.fieldsDefintion = {
            instrumentId: {
                type: String,
                description: 'Die ID des Instruments. Gleichlautend wie der Ordner in dem alle Medieninhalte liegen (z. B. Floete)'
            }
        };
    }
    normalizeFields(fields) {
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
exports.InstrumentMaster = InstrumentMaster;
