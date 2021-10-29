"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SectionMaster = void 0;
const master_1 = require("../master");
class SectionMaster extends master_1.Master {
    constructor() {
        super(...arguments);
        this.name = 'section';
        this.displayName = 'Abschnitt';
    }
}
exports.SectionMaster = SectionMaster;
