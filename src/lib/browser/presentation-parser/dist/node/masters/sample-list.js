"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SampleListMaster = void 0;
const master_1 = require("../master");
class SampleListMaster extends master_1.Master {
    constructor() {
        super(...arguments);
        this.name = 'sampleList';
        this.displayName = 'Audio-Ausschnitte';
        this.iconSpec = {
            name: 'music',
            color: 'red'
        };
    }
}
exports.SampleListMaster = SampleListMaster;
