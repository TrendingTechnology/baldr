"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SectionMaster = void 0;
const _types_1 = require("./_types");
class SectionMaster extends _types_1.Master {
    constructor() {
        super(...arguments);
        this.name = 'section';
        this.displayName = 'Abschnitt';
    }
}
exports.SectionMaster = SectionMaster;
