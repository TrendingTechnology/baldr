import { DataCutter } from './data-management';
import { MasterWrapper, FieldData } from './master';
import { Step, StepCollector } from './step';
import { WrappedUriList } from './fuzzy-uri';
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
    stepCollector: StepCollector;
    readonly meta: SlideMeta;
    readonly master: MasterWrapper;
    /**
     * In this attribute we save the normalized field data of a slide.
     */
    fields?: FieldData;
    /**
     * URIs of media assets that must necessarily be present.
     */
    readonly mediaUris: Set<string>;
    /**
     * URIs of media assets that do not have to exist.
     */
    readonly optionalMediaUris: Set<string>;
    readonly audioOverlay?: WrappedUriList;
    constructor(raw: any, no: number, level: number);
    private detectMaster;
    private parseAudioOverlay;
    /**
     * If the slide has no steps, then the array remains empty.
     */
    get steps(): Step[];
    get plainText(): string | undefined;
    /**
     * The title of the slide. The HTML tags are removed. First the metadata field
     * `title` (`- title: Title`) is used, then a string obtained from the master
     * hook `deriveTitleFromFields`, then the getter `this.plainText` and finally
     * the master name.
     */
    get title(): string;
    /**
     *
     */
    get detailedTitle(): string;
    /**
     * Log to the console.
     */
    log(): void;
}
export {};