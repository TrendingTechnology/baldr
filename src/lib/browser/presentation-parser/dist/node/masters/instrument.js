"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstrumentMaster = void 0;
const master_1 = require("../master");
class InstrumentMaster extends master_1.Master {
    constructor() {
        super(...arguments);
        this.name = 'instrument';
        this.displayName = 'Instrument';
        this.iconSpec = {
            name: 'instrument',
            color: 'yellow'
        };
    }
}
exports.InstrumentMaster = InstrumentMaster;
