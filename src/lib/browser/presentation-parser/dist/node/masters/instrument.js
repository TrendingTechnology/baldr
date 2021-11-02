"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstrumentMaster = void 0;
const master_1 = require("../master");
class InstrumentMaster extends master_1.Master {
    constructor() {
        super(...arguments);
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
}
exports.InstrumentMaster = InstrumentMaster;
