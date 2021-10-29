"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuoteMaster = void 0;
const _types_1 = require("./_types");
class QuoteMaster extends _types_1.Master {
    constructor() {
        super(...arguments);
        this.name = 'quote';
        this.displayName = 'Zitat';
    }
}
exports.QuoteMaster = QuoteMaster;
