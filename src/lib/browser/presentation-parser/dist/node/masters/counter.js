"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CounterMaster = void 0;
const _types_1 = require("./_types");
class CounterMaster extends _types_1.Master {
    constructor() {
        super(...arguments);
        this.name = 'counter';
        this.displayName = 'Zähler';
    }
}
exports.CounterMaster = CounterMaster;
