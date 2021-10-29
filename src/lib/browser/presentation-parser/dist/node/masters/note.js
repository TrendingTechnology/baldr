"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoteMaster = void 0;
const master_1 = require("../master");
class NoteMaster extends master_1.Master {
    constructor() {
        super(...arguments);
        this.name = 'note';
        this.displayName = 'Hefteintrag';
    }
}
exports.NoteMaster = NoteMaster;
