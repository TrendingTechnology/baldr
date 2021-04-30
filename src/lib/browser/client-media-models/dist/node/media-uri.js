"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaUriCache = exports.findMediaUris = exports.makeMediaUris = exports.MediaUri = void 0;
/**
 * Uniform Resource Identifier for media files, for example `ref:Haydn`, or
 * `http://example.com/Haydn_Joseph.jpg`. An optional fragment (`#1-7`) (subset
 * selector) maybe included.
 *
 * Possible URIs are for example:
 * `ref:Rhythm-n-Blues-Rock-n-Roll_BD_Bill-Haley#complete`
 * `uuid:c262fe9b-c705-43fd-a5d4-4bb38178d9e7`
 */
class MediaUri {
    /**
     * @param uri - `uuid:c262fe9b-c705-43fd-a5d4-4bb38178d9e7#2-3` or
     * `ref:Beethoven_Ludwig-van#-4`
     */
    constructor(uri) {
        this.raw = uri;
        const matches = MediaUri.regExp.exec(uri);
        if (matches == null || matches.groups == null) {
            throw new Error(`The media URI is not valid: ${uri}`);
        }
        const groups = matches.groups;
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
     * @param uri A media URI.
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
}
exports.MediaUri = MediaUri;
MediaUri.schemes = ['ref', 'uuid'];
MediaUri.regExpAuthority = 'a-zA-Z0-9-_';
/**
 * `#Sample1` or `#1,2,3` or `#-4`
 */
MediaUri.regExpFragment = MediaUri.regExpAuthority + ',';
MediaUri.regExp = new RegExp('(?<uri>' +
    '(?<scheme>' + MediaUri.schemes.join('|') + ')' +
    ':' +
    '(' +
    '(?<authority>[' + MediaUri.regExpAuthority + ']+)' +
    '(' +
    '#' +
    '(?<fragment>[' + MediaUri.regExpFragment + ']+)' +
    ')?' +
    ')' +
    ')');
/**
 * Make Media URI objects for a single URI or an array of URIs.
 *
 * @param uris - A single media URI or an array of media URIs.
 *
 * @returns An array of media URIs objects.
 */
function makeMediaUris(uris) {
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
exports.makeMediaUris = makeMediaUris;
function findMediaUris(data, uris) {
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
            uris.add(data);
        }
    }
}
exports.findMediaUris = findMediaUris;
/**
 * Media assets have two URIs: uuid:... and ref:...
 */
class MediaUriCache {
    constructor() {
        this.refs = {};
        this.uuids = {};
    }
    addPair(ref, uuid) {
        if (this.refs[ref] == null && this.uuids[uuid] == null) {
            this.refs[ref] = uuid;
            this.uuids[uuid] = ref;
            return true;
        }
        return false;
    }
    getRefFromUuid(uuid) {
        if (this.uuids[uuid] != null) {
            return this.uuids[uuid];
        }
    }
    getId(uuidOrRef) {
        if (uuidOrRef.indexOf('uuid:') === 0) {
            return this.getRefFromUuid(uuidOrRef);
        }
        return uuidOrRef;
    }
    getUuidFromRef(id) {
        if (this.refs[id] != null) {
            return this.refs[id];
        }
    }
}
exports.MediaUriCache = MediaUriCache;
