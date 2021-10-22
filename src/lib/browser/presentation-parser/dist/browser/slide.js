/**
 * Get the intersection between all master names and the slide keys.
 *
 * This method can be used to check that a slide object uses only
 * one master slide.
 *
 * @return The intersection as an array
 */
function intersect(array1, array2) {
    return array1.filter((n) => array2.includes(n));
}
export class Slide {
    constructor(raw) {
    }
}
