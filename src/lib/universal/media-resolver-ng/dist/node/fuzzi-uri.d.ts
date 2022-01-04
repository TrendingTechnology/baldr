/**
 * @file
 * Wrap a media asset or a sample URI with a title in an object. Allow fuzzy
 * specification of the URIs.
 */
export declare type FuzzyUriInput = string | WrappedUri | string[] | WrappedUri[];
export interface WrappedUri {
    uri: string;
    title?: string;
}
/**
 * This class holds a list of wrapped URIs.
 */
export declare class WrappedUriList {
    list: WrappedUri[];
    constructor(spec: FuzzyUriInput);
    /**
     * Get all URIs (without sample fragment)
     */
    get uris(): Set<string>;
    [Symbol.iterator](): Generator<WrappedUri, any, any>;
}
export declare function extractUrisFromFuzzySpecs(spec: FuzzyUriInput): Set<string>;
