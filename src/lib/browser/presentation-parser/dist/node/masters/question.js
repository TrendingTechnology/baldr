"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionMaster = void 0;
const _types_1 = require("./_types");
class QuestionMaster extends _types_1.Master {
    constructor() {
        super(...arguments);
        this.name = 'question';
        this.displayName = 'Frage';
    }
}
exports.QuestionMaster = QuestionMaster;
