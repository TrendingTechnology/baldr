import { DataCutter } from './data-management';
import { Master } from './master/_master';
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
    /**
     * The slide number
     */
    no: number;
    /**
     * The level in the hierarchial slide tree.
     */
    level: number;
    /**
     * An array of child slide objects.
     */
    slides?: Slide[];
    metaData: SlideMetaData;
    master: Master;
    constructor(raw: any, no: number, level: number);
    private detectMaster;
}
