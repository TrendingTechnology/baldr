import { DataCutter } from './data-management';
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
export class SlideMetaData {
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
export class Slide {
    constructor(raw) {
        const data = new DataCutter(raw);
        this.metaData = new SlideMetaData(data);
    }
}
