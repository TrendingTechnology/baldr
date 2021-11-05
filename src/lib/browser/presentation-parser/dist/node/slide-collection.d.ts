import { Slide } from './slide';
/**
 * A container class to store all slide objects of a presentation.
 */
export declare class SlideCollection {
    /**
     * A flat list of slide objects. All child slides are included in this
     * array.
     */
    flat: Slide[];
    /**
     * Only the top level slide objects are included in this array. Child slides
     * can be accessed under the `slides` property of each slide object.
     */
    tree: Slide[];
    /**
     * @param raw - The raw slide array from the presentation’s slide property.
     */
    constructor(raw: any[]);
    /**
     * Parse the slide objects in a recursive fashion. Child slides can be
     * specified under the `slides` property.
     *
     * @param raw - The raw slide array from the YAML presentation file, the
     *  slides property.
     * @param level - The level in the hierachial tree the slide lies in 1: Main
     *   level, 2: First child level ...
     */
    private parse;
    /**
     * The media URIs from the slide attributes `mediaUris` and `audioOverlay`.
     */
    get mediaUris(): Set<string>;
    get optionalMediaUris(): Set<string>;
    get numberOfSlides(): number;
    [Symbol.iterator](): Generator<Slide, any, any>;
}
