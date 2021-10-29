"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionMaster = void 0;
const master_1 = require("../master");
class QuestionMaster extends master_1.Master {
    constructor() {
        super(...arguments);
        this.name = 'question';
        this.displayName = 'Frage';
    }
}
exports.QuestionMaster = QuestionMaster;
