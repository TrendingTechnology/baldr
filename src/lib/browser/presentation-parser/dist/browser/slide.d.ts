import { DataCutter } from './data-management';
import { Master, FieldData } from './master';
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
    /**
     * In this attribute we save the normalized field data of a slide.
     */
    fields: FieldData;
    /**
     * Props (properties) to send to the main Vue master component.
     */
    propsMain?: any;
    /**
     * Props (properties) to send to the preview Vue master component.
     */
    propsPreview?: any;
    /**
     * URIs of media assets that must necessarily be present.
     */
    mediaUris: Set<string>;
    /**
     * URIs of media assets that do not have to exist.
     */
    optionalMediaUris: Set<string>;
    constructor(raw: any, no: number, level: number);
    private detectMaster;
}
