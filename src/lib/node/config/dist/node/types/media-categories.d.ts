/**
 * The specification of a media metadata property.
 */
export interface Prop {
    /**
     * A title of the property.
     */
    title: string;
    /**
     * A text which describes the property.
     */
    description?: string;
    /**
     * True if the property is required.
     */
    required?: boolean;
    /**
     * Overwrite the original value by the
     * the value obtained from the `derive` function.
     */
    overwriteByDerived?: boolean;
    /**
     * See package `@bldr/wikidata`. In the stripped version of the media
     * categories collection this property is converted to `true`.
     */
    wikidata?: boolean;
    /**
     * `absent` or `present`
     */
    state?: 'absent' | 'present';
}
/**
 * The specification of all properties. The single `propSpec`s are indexed
 * by the `propName`.
 *
 * ```js
 * const propSpecs = {
 *   propName1: propSpec1,
 *   propName2: propSpec2
 *   ...
 * }
 * ```
 */
export interface PropCollection {
    [key: string]: Prop;
}
/**
 * Apart from different file formats, media files can belong to several media
 * categories regardless of their file format.
 */
export interface Category {
    /**
     * A title for the media category.
     */
    title: string;
    /**
     * A text to describe a media category.
     */
    description?: string;
    /**
     * A two letter abbreviation. Used in the IDs.
     */
    abbreviation?: string;
    /**
     * The base path where all meta typs stored in.
     */
    basePath?: string;
    /**
     *
     */
    props: PropCollection;
}
/**
 * A collection of all media categories.
 *
 * ```js
 * const Collection = {
 *   name1: category1,
 *   name2: category2
 *   ...
 * }
 * ```
 */
export interface Collection {
    cloze: Category;
    composition: Category;
    cover: Category;
    documentation: Category;
    excerpt: Category;
    famousPiece: Category;
    group: Category;
    instrument: Category;
    person: Category;
    photo: Category;
    radio: Category;
    recording: Category;
    reference: Category;
    sample: Category;
    score: Category;
    song: Category;
    videoClip: Category;
    worksheet: Category;
    youtube: Category;
    general: Category;
}
