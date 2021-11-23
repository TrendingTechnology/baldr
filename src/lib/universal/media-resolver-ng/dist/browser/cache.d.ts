import * as Types from './types';
/**
 * This class manages the counter for one MIME type (`audio`, `image` and `video`).
 */
export declare class MimeTypeShortcutCounter {
    /**
     * `a` for audio files and `v` for video files.
     */
    private readonly triggerKey;
    private count;
    constructor(triggerKey: string);
    /**
     * Get the next available shortcut: `a 1`, `a 2`
     */
    get(): string | undefined;
    reset(): void;
}
export declare class Cache<T> implements Types.Cache<T> {
    protected cache: {
        [ref: string]: T;
    };
    constructor();
    /**
     * Add a media object to the cache.
     *
     * @param ref - A URI in the `ref` scheme. The URI must begin with the prefix
     *   `ref:`
     * @param mediaObject - The media object (a asset or a sample) to be stored.
     *
     * @returns True if the media object is stored, false if the object is already
     * stored.
     */
    add(ref: string, mediaObject: T): boolean;
    /**
     * Retrieve a media object.
     *
     * @param ref - A URI in the `ref` scheme. The URI must begin with the prefix
     *   `ref:`
     *
     * @returns The stored media object or undefined.
     */
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
