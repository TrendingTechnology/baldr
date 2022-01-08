/**
 * Meta informations can be added to each slide. All properties are possibly
 * undefined.
 */
export class SlideMeta {
    /**
     * An unique reference string of a slide (Used for links). Markdown is supported in this property.
     */
    ref;
    /**
     * The title of a slide. Markdown is supported in this property.
     */
    title;
    /**
     * Some text that describes the slide. Markdown is supported in this property.
     */
    description;
    /**
     * The source of the slide, for example a HTTP URL. Markdown is supported in
     * this property.
     */
    source;
}
