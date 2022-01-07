/**
 * Example `ref:Alla-Turca#complete`
 */
interface UriSplittedByFragment {
    /**
     * Prefix before `#`, for example `ref:Alla-Turca`
     */
    prefix: string;
    /**
     * The fragment, suffix after `#`, for example `complete`
     */
    fragment?: string;
}
/**
 * This class represents an Uniform Resource Identifier (URI) for media and
 * presentation files. An optional fragment (`#1-7`) (subset or sample selector)
 * maybe included.
 *
 * Possible URIs are for example:
 * `ref:Rhythm-n-Blues-Rock-n-Roll_BD_Bill-Haley#complete`
 * `uuid:c262fe9b-c705-43fd-a5d4-4bb38178d9e7`
 */
export declare class MediaUri {
    private static readonly schemes;
    private static readonly regExpAuthority;
    /**
     * `#Sample1` or `#1,2,3` or `#-4`
     */
    private static readonly regExpFragment;
    static regExp: RegExp;
    /**
     * For example: `ref:Beethoven_Ludwig-van#-4` or
     * `uuid:c262fe9b-c705-43fd-a5d4-4bb38178d9e7#1,2,5-7`
     */
    raw: string;
    /**
     * For example: `ref` or `uuid`.
     */
    scheme: 'ref' | 'uuid';
    /**
     * For example: `Beethoven_Ludwig-van` or
     * `c262fe9b-c705-43fd-a5d4-4bb38178d9e7`
     */
    authority: string;
    /**
     * For example: `ref:Beethoven_Ludwig-van` or
     * `uuid:c262fe9b-c705-43fd-a5d4-4bb38178d9e7`
     */
    uriWithoutFragment: string;
    /**
     * For example: `-4` or `uuid:c262fe9b-c705-43fd-a5d4-4bb38178d9e7#1,2,5-7`
     */
    fragment?: string;
    /**
     * @param uri - A Uniform Resource Identifier (URI). For example:
     *   `ref:Beethoven_Ludwig-van#-4` or
     *   `uuid:c262fe9b-c705-43fd-a5d4-4bb38178d9e7#1,2,5-7`
     */
    constructor(uri: string);
    /**
     * Check if the given media URI is a valid media URI.
     *
     * @param uri - A media URI.
     *
     * @returns True if the given URI is a valid media URI.
     */
    static check(uri: string): boolean;
    /**
     * Check if the input is a valid URI.
     *
     * @param uri -  The URI to validate.
     *
     * @returns The unchanged URI.
     *
     * @throws If the given URI is not valid.
     */
    static validate(uri: string): string;
    static compose(scheme: 'ref' | 'uuid', authority: string, fragment?: string): string;
    static splitByFragment(uri: string): UriSplittedByFragment;
    /**
     * Remove the fragment suffix of an media URI.
     *
     * @param uri - A media URI (Uniform Resource Identifier) with an optional
     *   fragment suffix, for example `ref:Yesterday#complete`.
     *
     * @returns A media URI (Uniform Resource Identifier) without an optional
     *   fragment suffix, for example `ref:Yesterday`.
     */
    static removeFragment(uri: string): string;
    /**
     * Remove the scheme prefix from a media URI, for example `ref:Fuer-Elise` is
     * converted to `Fuer-Elise`.
     *
     * @param uri A media URI.
     *
     * @returns The URI without the scheme, for example `Fuer-Elise`.
     */
    static removeScheme(uri: string): string;
}
/**
 * Make Media URI objects from a single URI or an array of URIs.
 *
 * @param uris - A single media URI or an array of media URIs.
 *
 * @returns An array of media URIs objects.
 */
export declare function makeMediaUris(uris: string | string[] | Set<string>): MediaUri[];
/**
 * Find recursively media URIs. Suffix fragments will be removed.
 *
 * @param data An object, an array or a string.
 * @param uris This set is filled with the results.
 */
export declare function findMediaUris(data: any, uris: Set<string>): void;
export {};
