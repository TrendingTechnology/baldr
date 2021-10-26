import { DataCutter } from './data-management';
/**
 * The meta data of a slide. Each slide object owns one meta data object.
 */
export declare class SlideMetaData {
    /**
     * The ID of a slide (Used for links)
     */
    ref?: string;
    /**
     * The title of a slide.
     */
    title?: string;
    /**
     * Some text that describes the slide.
     */
    description?: string;
    /**
     * The source of the slide, for example a HTTP URL.
     */
    source?: string;
    /**
     * @param {Object} rawSlideObject
     */
    constructor(data: DataCutter);
}
export declare class Slide {
    metaData: SlideMetaData;
    constructor(raw: any);
}
