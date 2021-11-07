import { Slide } from './slide';
/**
 * A container class to store all slide objects of a presentation.
 */
export class SlideCollection {
    /**
     * @param raw - The raw slide array from the presentation’s slide property.
     */
    constructor(raw) {
        /**
         * A flat list of slide objects. All child slides are included in this
         * array.
         */
        this.flat = [];
        /**
         * Only the top level slide objects are included in this array. Child slides
         * can be accessed under the `slides` property of each slide object.
         */
        this.tree = [];
        this.parse(raw, this.tree, 1);
        this.mediaUris = this.collectMediaUris();
        this.optionalMediaUris = this.collectOptionalMediaUris();
    }
    /**
     * Parse the slide objects in a recursive fashion. Child slides can be
     * specified under the `slides` property.
     *
     * @param raw - The raw slide array from the YAML presentation file, the
     *  slides property.
     * @param level - The level in the hierachial tree the slide lies in 1: Main
     *   level, 2: First child level ...
     */
    parse(raw, slidesTree, level) {
        for (const slideRaw of raw) {
            if (slideRaw.state !== 'absent') {
                const childSlides = slideRaw.slides;
                delete slideRaw.slides;
                const slide = new Slide(slideRaw, this.flat.length + 1, level);
                this.flat.push(slide);
                slidesTree.push(slide);
                if (childSlides != null && Array.isArray(childSlides)) {
                    slide.slides = [];
                    this.parse(childSlides, slide.slides, level + 1);
                }
            }
        }
    }
    /**
     * The media URIs from the slide attributes `mediaUris` and `audioOverlay`.
     */
    collectMediaUris() {
        const result = new Set();
        for (const slide of this.flat) {
            for (const mediaUri of slide.mediaUris) {
                result.add(mediaUri);
            }
            if (slide.audioOverlay != null) {
                for (const mediaUri of slide.audioOverlay.uris) {
                    result.add(mediaUri);
                }
            }
        }
        return result;
    }
    collectOptionalMediaUris() {
        const result = new Set();
        for (const slide of this.flat) {
            for (const mediaUri of slide.optionalMediaUris) {
                result.add(mediaUri);
            }
        }
        return result;
    }
    get numberOfSlides() {
        return this.flat.length;
    }
    *[Symbol.iterator]() {
        for (const slide of this.flat) {
            yield slide;
        }
    }
}
