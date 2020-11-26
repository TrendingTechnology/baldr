"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Slide = void 0;
class SlideMetaData {
}
/**
 * A slide.
 */
class Slide {
    constructor(rawData) {
        this.rawData = rawData;
        this.no = 0;
        this.level = 0;
        this.slides = [];
    }
}
exports.Slide = Slide;
