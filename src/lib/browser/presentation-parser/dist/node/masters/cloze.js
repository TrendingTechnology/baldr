"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClozeMaster = void 0;
const _types_1 = require("./_types");
class ClozeMaster extends _types_1.Master {
    constructor() {
        super(...arguments);
        this.name = 'cloze';
        this.displayName = 'Lückentext';
    }
}
exports.ClozeMaster = ClozeMaster;
