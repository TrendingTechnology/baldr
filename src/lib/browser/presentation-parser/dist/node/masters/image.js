"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageMaster = void 0;
const master_1 = require("../master");
class ImageMaster extends master_1.Master {
    constructor() {
        super(...arguments);
        this.name = 'image';
        this.displayName = 'Bild';
    }
}
exports.ImageMaster = ImageMaster;
