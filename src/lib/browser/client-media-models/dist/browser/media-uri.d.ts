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
 * Uniform Resource Identifier for media files, for example `ref:Haydn`, or
 * `http://example.com/Haydn_Joseph.jpg`. An optional fragment (`#1-7`) (subset
 * selector) maybe included.
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
     * The full, raw and unmodifed URI (Uniform Resource Identifier) as specified,
     * for example `uuid:c262fe9b-c705-43fd-a5d4-4bb38178d9e7#2-3` or
     * `ref:Beethoven_Ludwig-van#-4`.
     */
    raw: string;
    /**
     * for example: `ref`, `uuid`, `http`, `https`, `blob`
     */
    scheme: string;
    /**
     * for example: `//example.com/Haydn_Joseph.jpg`,
     * `c262fe9b-c705-43fd-a5d4-4bb38178d9e7` or `Beethoven_Ludwig-van`.
     */
    authority: string;
    /**
     * `uuid:c262fe9b-c705-43fd-a5d4-4bb38178d9e7` or `ref:Beethoven_Ludwig-van`
     */
    uriWithoutFragment: string;
    /**
     * `2-3` or `-4`
     */
    fragment?: string;
    /**
     * @param uri - `uuid:c262fe9b-c705-43fd-a5d4-4bb38178d9e7#2-3` or
     * `ref:Beethoven_Ludwig-van#-4`
     */
    constructor(uri: string);
    /**
     * Check if the given media URI is a valid media URI.
     *
     * @param uri A media URI.
     *
     * @returns True if the given URI is a valid media URI.
     */
    static check(uri: string): boolean;
    static splitByFragment(uri: string): UriSplittedByFragment;
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
export declare function findMediaUris(data: any, uris: Set<string>): void;
export {};
