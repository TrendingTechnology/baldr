"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenericMaster = void 0;
const master_1 = require("../master");
class GenericMaster extends master_1.Master {
    constructor() {
        super(...arguments);
        this.name = 'generic';
        this.displayName = 'Folie';
        this.icon = {
            name: 'file-presentation-box',
            color: 'gray',
            showOnSlides: false
        };
    }
}
exports.GenericMaster = GenericMaster;
