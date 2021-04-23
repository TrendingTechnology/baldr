/**
 * Uniform Resource Identifier for media files, for example `id:Haydn`, or
 * `http://example.com/Haydn_Joseph.jpg`. An optional fragment (`#1-7`) (subset
 * selector) maybe included.
 *
 * Possible URIs are for example:
 * `id:Rhythm-n-Blues-Rock-n-Roll_BD_Bill-Haley#complete`
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
     * The full, raw and unmodifed URI (Uniform Resource Identifier) as specified, for example
     * `uuid:c262fe9b-c705-43fd-a5d4-4bb38178d9e7#2-3` or `id:Beethoven_Ludwig-van#-4`.
     */
    raw: string;
    /**
     * for example: `id`, `uuid`, `http`, `https`, `blob`
     */
    scheme: string;
    /**
     * for example: `//example.com/Haydn_Joseph.jpg`,
     * `c262fe9b-c705-43fd-a5d4-4bb38178d9e7` or `Beethoven_Ludwig-van`.
     */
    authority: string;
    /**
     * `uuid:c262fe9b-c705-43fd-a5d4-4bb38178d9e7` or `id:Beethoven_Ludwig-van`
     */
    uriWithoutFragment: string;
    /**
     * `2-3` or `-4`
     */
    fragment?: string;
    /**
     * @param uri - `uuid:c262fe9b-c705-43fd-a5d4-4bb38178d9e7#2-3` or `id:Beethoven_Ludwig-van#-4`
     */
    constructor(uri: string);
}
