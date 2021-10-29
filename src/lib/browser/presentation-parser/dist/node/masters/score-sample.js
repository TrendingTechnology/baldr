"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScoreSampleMaster = void 0;
const master_1 = require("../master");
class ScoreSampleMaster extends master_1.Master {
    constructor() {
        super(...arguments);
        this.name = 'scoreSample';
        this.displayName = 'Notenbeispiel';
    }
}
exports.ScoreSampleMaster = ScoreSampleMaster;
