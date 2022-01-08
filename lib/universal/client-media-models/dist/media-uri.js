/**
 * This class represents an Uniform Resource Identifier (URI) for media and
 * presentation files. An optional fragment (`#1-7`) (subset or sample selector)
 * maybe included.
 *
 * Possible URIs are for example:
 * `ref:Rhythm-n-Blues-Rock-n-Roll_BD_Bill-Haley#complete`
 * `uuid:c262fe9b-c705-43fd-a5d4-4bb38178d9e7`
 */
export class MediaUri {
    static schemes = ['ref', 'uuid'];
    static regExpAuthority = 'a-zA-Z0-9-_';
    /**
     * `#Sample1` or `#1,2,3` or `#-4`
     */
    static regExpFragment = MediaUri.regExpAuthority + ',';
    static regExp = new RegExp('(?<uri>' +
        '(?<scheme>' +
        MediaUri.schemes.join('|') +
        ')' +
        ':' +
        '(' +
        '(?<authority>[' +
        MediaUri.regExpAuthority +
        ']+)' +
        '(' +
        '#' +
        '(?<fragment>[' +
        MediaUri.regExpFragment +
        ']+)' +
        ')?' +
        ')' +
        ')');
    /**
     * For example: `ref:Beethoven_Ludwig-van#-4` or
     * `uuid:c262fe9b-c705-43fd-a5d4-4bb38178d9e7#1,2,5-7`
     */
    raw;
    /**
     * For example: `ref` or `uuid`.
     */
    scheme;
    /**
     * For example: `Beethoven_Ludwig-van` or
     * `c262fe9b-c705-43fd-a5d4-4bb38178d9e7`
     */
    authority;
    /**
     * For example: `ref:Beethoven_Ludwig-van` or
     * `uuid:c262fe9b-c705-43fd-a5d4-4bb38178d9e7`
     */
    uriWithoutFragment;
    /**
     * For example: `-4` or `uuid:c262fe9b-c705-43fd-a5d4-4bb38178d9e7#1,2,5-7`
     */
    fragment;
    /**
     * @param uri - A Uniform Resource Identifier (URI). For example:
     *   `ref:Beethoven_Ludwig-van#-4` or
     *   `uuid:c262fe9b-c705-43fd-a5d4-4bb38178d9e7#1,2,5-7`
     */
    constructor(uri) {
        this.raw = uri;
        const matches = MediaUri.regExp.exec(uri);
        if (matches == null || matches.groups == null) {
            throw new Error(`The media URI is not valid: ${uri}`);
        }
        const groups = matches.groups;
        if (groups.scheme !== 'ref' && groups.scheme !== 'uuid') {
            throw new Error('Media URI scheme has to be ref or uuid');
        }
        this.scheme = groups.scheme;
        this.authority = groups.authority;
        if (groups.fragment != null) {
            this.uriWithoutFragment = `${this.scheme}:${this.authority}`;
            this.fragment = groups.fragment;
        }
        else {
            this.uriWithoutFragment = uri;
        }
    }
    /**
     * Check if the given media URI is a valid media URI.
     *
     * @param uri - A media URI.
     *
     * @returns True if the given URI is a valid media URI.
     */
    static check(uri) {
        const matches = MediaUri.regExp.exec(uri);
        if (matches != null) {
            return true;
        }
        return false;
    }
    /**
     * Check if the input is a valid URI.
     *
     * @param uri -  The URI to validate.
     *
     * @returns The unchanged URI.
     *
     * @throws If the given URI is not valid.
     */
    static validate(uri) {
        if (!MediaUri.check(uri)) {
            throw new Error(`The URI “${uri}” is not valid!`);
        }
        return uri;
    }
    static compose(scheme, authority, fragment = '') {
        if (fragment !== '') {
            fragment = '#' + fragment;
        }
        return `${scheme}:${authority}${fragment}`;
    }
    static splitByFragment(uri) {
        if (uri.indexOf('#') > 0) {
            const segments = uri.split('#');
            if (segments.length !== 2) {
                throw new Error(`The media URI ${uri} couldn’t be splitted`);
            }
            return {
                prefix: segments[0],
                fragment: segments[1]
            };
        }
        return {
            prefix: uri
        };
    }
    /**
     * Remove the fragment suffix of an media URI.
     *
     * @param uri - A media URI (Uniform Resource Identifier) with an optional
     *   fragment suffix, for example `ref:Yesterday#complete`.
     *
     * @returns A media URI (Uniform Resource Identifier) without an optional
     *   fragment suffix, for example `ref:Yesterday`.
     */
    static removeFragment(uri) {
        const splitted = MediaUri.splitByFragment(uri);
        return splitted.prefix;
    }
    /**
     * Remove the scheme prefix from a media URI, for example `ref:Fuer-Elise` is
     * converted to `Fuer-Elise`.
     *
     * @param uri A media URI.
     *
     * @returns The URI without the scheme, for example `Fuer-Elise`.
     */
    static removeScheme(uri) {
        if (uri.indexOf('ref:') === 0) {
            return uri.replace('ref:', '');
        }
        else if (uri.indexOf('uuid:') === 0) {
            return uri.replace('uuid:', '');
        }
        else {
            return uri;
        }
    }
}
/**
 * Make Media URI objects from a single URI or an array of URIs.
 *
 * @param uris - A single media URI or an array of media URIs.
 *
 * @returns An array of media URIs objects.
 */
export function makeMediaUris(uris) {
    let urisNormalized;
    if (typeof uris === 'string') {
        urisNormalized = new Set([uris]);
    }
    else if (Array.isArray(uris)) {
        urisNormalized = new Set(uris);
    }
    else {
        urisNormalized = uris;
    }
    const mediaUris = [];
    for (const uri of urisNormalized) {
        mediaUris.push(new MediaUri(uri));
    }
    return mediaUris;
}
/**
 * Find recursively media URIs. Suffix fragments will be removed.
 *
 * @param data An object, an array or a string.
 * @param uris This set is filled with the results.
 */
export function findMediaUris(data, uris) {
    // Array
    if (Array.isArray(data)) {
        for (let i = 0; i < data.length; i++) {
            findMediaUris(data[i], uris);
        }
        // Object
    }
    else if (typeof data === 'object') {
        for (const prop in data) {
            findMediaUris(data[prop], uris);
        }
    }
    else if (typeof data === 'string') {
        if (MediaUri.check(data)) {
            uris.add(MediaUri.removeFragment(data));
        }
    }
}
