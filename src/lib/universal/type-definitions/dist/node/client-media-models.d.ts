/**
 * Uniform Resource Identifier for media files, for example `ref:Haydn`, or
 * `http://example.com/Haydn_Joseph.jpg`. An optional fragment (`#1-7`) (subset
 * selector) maybe included.
 *
 * Possible URIs are for example:
 * `ref:Rhythm-n-Blues-Rock-n-Roll_BD_Bill-Haley#complete`
 * `uuid:c262fe9b-c705-43fd-a5d4-4bb38178d9e7`
 */
export interface MediaUri {
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
}
