/**
 * Wrap a sample with some custom meta data (mostly a custom title). Allow
 * different input specifications. Allow fuzzy specification of the samples.
 *
 * @module @bldr/wrapped-sample
 */
interface SimpleSampleSpec {
    uri: string;
    title?: string;
}
/**
 * This class holds the specification of the wrapped sample. The sample object
 * itself is not included in this class.
 */
declare class WrappedSampleSpec {
    /**
     * The URI of a sample.
     */
    uri: string;
    /**
     * The manually set title.
     */
    readonly customTitle?: string;
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
}
export declare class WrappedSampleSpecList {
    specs: WrappedSampleSpec[];
    /**
     * @param spec - Different input specifications are
     *   possible:
     *
     *   1. The sample URI as a string (for example: `ref:Fuer-Elise_HB`).
     *   2. An object with the mandatory property `uri` (for example:
     *      `{ uri: 'ref:Fuer-Elise_HB'}`).
     *   3. An array
     */
    constructor(spec: string | SimpleSampleSpec | string[] | SimpleSampleSpec[]);
    /**
     * Get the URI of all wrapped samples.
     */
    get uris(): Set<string>;
}
/**
 * This class holds the resolve sample object.
 */
export declare class WrappedSample {
    spec: WrappedSampleSpec;
    private readonly sample;
    constructor(spec: WrappedSampleSpec);
    /**
     * The manually set custom title or, if not set, the `titleSafe` of the
     * `sample`.
     *
     * We have to use a getter, because the sample may not be resolved at the
     * constructor time.
     */
    get title(): string | undefined;
}
export {};
