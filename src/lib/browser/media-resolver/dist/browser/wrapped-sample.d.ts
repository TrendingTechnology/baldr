/**
 * Wrap a sample with some custom meta data (mostly a custom title). Allow
 * different input specifications. Allow fuzzy specification of the samples.
 *
 * @module @bldr/wrapped-sample
 */
import { Sample } from './internal';
interface SimpleSampleSpec {
    uri: string;
    title?: string;
}
/**
 * This class holds the specification of a wrapped sample. The sample object
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
declare type WrappedSampleSpecInput = string | SimpleSampleSpec | string[] | SimpleSampleSpec[];
/**
 * This class holds the specification of a list of wrapped samples. The sample
 * objects itself are not included in this class.
 */
export declare class WrappedSampleSpecList {
    specs: WrappedSampleSpec[];
    /**
     * @param spec - This input options are available:
     *
     *   1. The sample URI as a string (for example: `ref:Fuer-Elise_HB`).
     *   2. An object with the mandatory property `uri` (for example:
     *      `{ uri: 'ref:Fuer-Elise_HB' }`).
     *   3. An array
     */
    constructor(spec: WrappedSampleSpecInput);
    /**
     * Get the URI of all wrapped samples.
     */
    get uris(): Set<string>;
    [Symbol.iterator](): Generator<WrappedSampleSpec, any, any>;
}
export declare function getUrisFromWrappedSpecs(spec: WrappedSampleSpecInput): Set<string>;
/**
 * This class holds the resolve sample object.
 */
export declare class WrappedSample {
    private readonly spec;
    private readonly sample;
    constructor(spec: WrappedSampleSpec, sample: Sample);
    /**
     * The manually set custom title or, if not set, the `titleSafe` of the
     * `sample`.
     *
     * We have to use a getter, because the sample may not be resolved at the
     * constructor time.
     */
    get title(): string | undefined;
}
export declare class WrappedSampleList {
    private readonly samples;
    constructor();
    add(spec: WrappedSampleSpec, sample: Sample): void;
    [Symbol.iterator](): Generator<WrappedSample, any, any>;
}
export {};
