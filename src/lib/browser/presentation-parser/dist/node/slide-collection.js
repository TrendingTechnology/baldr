"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const slide_1 = require("./slide");
class SlideCollection {
    /**
     * @param raw - The raw slide array from the presentation’s slide property.
     */
    constructor(raw) {
        /**
         * A flat list of slide objects. All child slides are included in this
         * array.
         */
        this.slidesFlat = [];
        /**
         * Only the top level slide objects are included in this array. Child slides
         * can be accessed under the `slides` property.
         */
        this.slidesTree = [];
        this.parse(raw, this.slidesTree, 1);
    }
    /**
     * Parse the slide objects in a recursive fashion. Child slides can be specified
     * under the `slides` property.
     *
     * @param raw - The raw slide array from the YAML presentation
     *  file, the slides property.
     * @param level - The level in the hierachial tree the slide lies in 1:
     *   Main level, 2: First child level ...
     */
    parse(raw, slidesTree, level) {
        for (const slideRaw of raw) {
            if (slideRaw.state !== 'absent') {
                const childSlides = slideRaw.slides;
                delete slideRaw.slides;
                const slide = new slide_1.Slide(slideRaw, this.slidesFlat.length + 1, level);
                this.slidesFlat.push(slide);
                slidesTree.push(slide);
                if (childSlides != null && Array.isArray(childSlides)) {
                    slide.slides = [];
                    this.parse(childSlides, slide.slides, level + 1);
                }
            }
        }
    }
}
