"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstrumentMaster = void 0;
const _types_1 = require("./_types");
class InstrumentMaster extends _types_1.Master {
    constructor() {
        super(...arguments);
        this.name = 'instrument';
        this.displayName = 'Instrument';
    }
}
exports.InstrumentMaster = InstrumentMaster;
