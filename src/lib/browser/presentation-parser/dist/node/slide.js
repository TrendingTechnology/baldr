"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Slide = exports.SlideMetaData = void 0;
const data_management_1 = require("./data-management");
/**
 * Get the intersection between all master names and the slide keys.
 *
 * This method can be used to check that a slide object uses only
 * one master slide.
 *
 * @return The intersection as an array
 */
function intersect(array1, array2) {
    return array1.filter(n => array2.includes(n));
}
/**
 * The meta data of a slide. Each slide object owns one meta data object.
 */
class SlideMetaData {
    /**
     * @param {Object} rawSlideObject
     */
    constructor(data) {
        this.ref = data.cutString('ref');
        this.title = data.cutString('title');
        this.description = data.cutString('description');
        this.source = data.cutString('source');
    }
}
exports.SlideMetaData = SlideMetaData;
class Slide {
    constructor(raw) {
        const data = new data_management_1.DataCutter(raw);
        this.metaData = new SlideMetaData(data);
    }
}
exports.Slide = Slide;
