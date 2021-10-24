import * as Types from './types';
export declare class Cache<T> implements Types.Cache<T> {
    protected cache: {
        [ref: string]: T;
    };
    constructor();
    add(ref: string, mediaObject: T): boolean;
    get(ref: string): T | undefined;
    /**
     * The size of the cache. Indicates how many media objects are in the cache.
     */
    get size(): number;
    getAll(): T[];
    reset(): void;
    [Symbol.iterator](): Generator<T, any, any>;
}
/**
 * Media assets have two URI schemes: `uuid:` and `ref:`. Internally we use only
 * the `ref` scheme. This cache enables the translation from `uuid` to `ref`
 * URIs.
 */
export declare class UriTranslator {
    private uuids;
    constructor();
    /**
     * @param ref - The authority in the reference (`ref`) scheme. The prefixed
     *   scheme can be omitted.
     * @param uuid - The authority in the Universally Unique Identifier (`uuid`)
     *   scheme. The prefixed scheme can be omitted.
     *
     * @returns True, if the uri authority pair was successfully added, false
     *   if the pair was already added.
     */
    addPair(ref: string, uuid: string): boolean;
    /**
     * Get the reference authority from the Universally Unique Identifier (uuid)
     * authority. The input must be specified without the scheme prefixes and the
     * output is prefixed with the `ref:` scheme.
     *
     * @param uuid With out the scheme prefix.
     *
     * @returns The reference authority with `ref:`
     */
    private getRefFromUuid;
    /**
     * Get the fully qualified media URI using the reference `ref` scheme. A URI
     * specified with `uuid` is converted to the `ref` scheme. A fragment
     * `#fragment` can be specified.
     *
     * @param uuidOrRef Scheme prefix is required, for example `ref:Mozart` or
     * `uuid:…`
     *
     * @returns A fully qualified media URI using the reference `ref` scheme, for
     * example `ref:Alla-Turca#complete`
     */
    getRef(uuidOrRef: string, withoutFragment?: boolean): string | undefined;
    reset(): void;
}
