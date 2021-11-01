"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InteractiveGraphicMaster = void 0;
const master_1 = require("../master");
class InteractiveGraphicMaster extends master_1.Master {
    constructor() {
        super(...arguments);
        this.name = 'interactiveGraphic';
        this.displayName = 'Interaktive Grafik';
        this.iconSpec = {
            name: 'image',
            color: 'blue',
            showOnSlides: false
        };
    }
}
exports.InteractiveGraphicMaster = InteractiveGraphicMaster;
