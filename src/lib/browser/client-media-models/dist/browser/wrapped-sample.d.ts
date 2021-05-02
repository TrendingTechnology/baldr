interface SimpleSampleSpec {
    uri: string;
    title?: string;
}
/**
 * Wrap a sample with some custom meta data (mostly a custom title). Allow
 * different input specifications.
 *
 * @see {@link module:@bldr/media-client.WrappedSampleList}
 * @see {@link module:@bldr/lamp/content-file~AudioOverlay}
 */
declare class WrappedSample {
    private readonly sample?;
    /**
     * The manually set title.
     */
    private readonly title?;
    /**
     * True if the title is set manually.
     *
     * This specification sets the property to `true`.
     * `{ title: 'My Title', uri: 'ref:Fuer-Elise' }`
     */
    isTitleSetManually: boolean;
    /**
     * The URI of a sample.
     */
    uri?: string;
    /**
     * @param spec - Different input specifications are
     *   possible:
     *
     *   1. The sample URI as a string (for example: `ref:Fuer-Elise_HB`).
     *   2. The sample URI inside the title text. (for example
     *      `ref:Fuer-Elise_HB Für Elise` or `Für Elise ref:Fuer-Elise_HB`)
     *   3. An object with the mandatory property `uri` (for example:
     *      `{ uri: 'ref:Fuer-Elise_HB'}`).
     */
    constructor(spec: string | SimpleSampleSpec);
    /**
     * The manually set title or, if not set, the `titleSafe` of the `sample`.
     *
     * We have to use a getter, because the sample may not be resolved at
     * the constructor time.
     */
    get titleSafe(): string | undefined;
}
/**
 * Wrap some samples with metadata. Allow fuzzy specification of the samples.
 * Normalize the input.
 *
 * @see {@link module:@bldr/media-client~WrappedSample}
 * @see {@link module:@bldr/lamp/content-file~AudioOverlay}
 */
export declare class WrappedSampleList {
    /**
     * True if the title of the first sample is set manually.
     *
     * This specification sets the property to `true`.
     * `{ title: 'My Title', uri: 'ref:Fuer-Elise' }`
     */
    isTitleSetManually: boolean;
    samples: WrappedSample[];
    /**
     * @param spec - Different input specifications are
     *   possible:
     *
     *   1. The sample URI as a string (for example: `ref:Fuer-Elise_HB`).
     *   2. An object with the mandatory property `uri` (for example:
     *      `{ uri: 'ref:Fuer-Elise_HB'}`).
     *   3. An instance of the class `Sample`.
     *   4. An array
     */
    constructor(spec: string | SimpleSampleSpec | string[] | SimpleSampleSpec[]);
    /**
     * Get the URI of all wrapped samples.
     */
    get uris(): string[];
}
export {};
