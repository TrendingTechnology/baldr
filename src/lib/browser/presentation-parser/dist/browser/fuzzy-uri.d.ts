/**
 * @file
 * Wrap a media asset or a sample URI with a title in an object. Allow fuzzy
 * specification of the URIs.
 */
declare type FuzzySpec = string | WrappedUri | string[] | WrappedUri[];
interface WrappedUri {
    uri: string;
    title?: string;
}
/**
 * This class holds a list of wrapped URIs.
 */
export declare class WrappedUriList {
    specs: WrappedUri[];
    constructor(spec: FuzzySpec);
    /**
     * Get all URIs (without sample fragment)
     */
    get uris(): Set<string>;
    [Symbol.iterator](): Generator<WrappedUri, any, any>;
}
export declare function extractUrisFromFuzzySpecs(spec: FuzzySpec): Set<string>;
export {};
