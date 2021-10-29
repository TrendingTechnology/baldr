"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoteMaster = void 0;
const _types_1 = require("./_types");
class NoteMaster extends _types_1.Master {
    constructor() {
        super(...arguments);
        this.name = 'note';
        this.displayName = 'Hefteintrag';
    }
}
exports.NoteMaster = NoteMaster;
