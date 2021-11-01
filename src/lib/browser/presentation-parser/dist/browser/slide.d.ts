import { DataCutter } from './data-management';
import { Master, FieldData } from './master';
/**
 * The meta data of a slide. Each slide object owns one meta data object.
 */
declare class SlideMeta {
    /**
     * The ID of a slide (Used for links)
     */
    readonly ref?: string;
    /**
     * The title of a slide.
     */
    readonly title?: string;
    /**
     * Some text that describes the slide.
     */
    readonly description?: string;
    /**
     * The source of the slide, for example a HTTP URL.
     */
    readonly source?: string;
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
    readonly meta: SlideMeta;
    readonly master: Master;
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
    readonly mediaUris: Set<string>;
    /**
     * URIs of media assets that do not have to exist.
     */
    readonly optionalMediaUris: Set<string>;
    constructor(raw: any, no: number, level: number);
    private detectMaster;
    /**
     * Log to the console.
     */
    log(): void;
}
export {};
