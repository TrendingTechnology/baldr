"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Presentation = void 0;
/**
 * A presentation is represented by the YAML file `Praesentation.baldr.yml`.
 * A presentation contains slides and meta data.
 */
class Presentation {
    constructor(slides, slidesTree) {
        this.slides = slides;
        this.slidesTree = slidesTree;
    }
}
exports.Presentation = Presentation;
