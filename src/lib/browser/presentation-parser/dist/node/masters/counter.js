"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CounterMaster = void 0;
const master_1 = require("../master");
class CounterMaster extends master_1.Master {
    constructor() {
        super(...arguments);
        this.name = 'counter';
        this.displayName = 'Zähler';
        this.iconSpec = {
            name: 'counter',
            color: 'black',
            size: 'large'
        };
    }
}
exports.CounterMaster = CounterMaster;
