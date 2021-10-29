"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageMaster = void 0;
const _types_1 = require("./_types");
class ImageMaster extends _types_1.Master {
    constructor() {
        super(...arguments);
        this.name = 'image';
        this.displayName = 'Bild';
    }
}
exports.ImageMaster = ImageMaster;
