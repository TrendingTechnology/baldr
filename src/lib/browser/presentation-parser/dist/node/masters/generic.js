"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenericMaster = void 0;
const _types_1 = require("./_types");
class GenericMaster extends _types_1.Master {
    constructor() {
        super(...arguments);
        this.name = 'generic';
        this.displayName = 'Folie';
    }
}
exports.GenericMaster = GenericMaster;
