"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuoteMaster = void 0;
const master_1 = require("../master");
class QuoteMaster extends master_1.Master {
    constructor() {
        super(...arguments);
        this.name = 'quote';
        this.displayName = 'Zitat';
        this.icon = {
            name: 'quote',
            color: 'brown',
            size: 'large'
        };
    }
}
exports.QuoteMaster = QuoteMaster;
