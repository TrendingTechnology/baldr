"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UriTranslator = exports.Cache = void 0;
const client_media_models_1 = require("@bldr/client-media-models");
/**
 * This class manages the counter for one MIME type (`audio`, `image` and `video`).
 */
class MimeTypeShortcutCounter {
    constructor(triggerKey) {
        this.triggerKey = triggerKey;
        this.count = 0;
    }
    /**
     * Get the next available shortcut: `a 1`, `a 2`
     */
    get() {
        if (this.count < 10) {
            this.count++;
            if (this.count === 10) {
                return `${this.triggerKey} 0`;
            }
            return `${this.triggerKey} ${this.count}`;
        }
    }
    reset() {
        this.count = 0;
    }
}
class Cache {
    constructor() {
        this.cache = {};
    }
    add(ref, mediaObject) {
        if (this.cache[ref] == null) {
            this.cache[ref] = mediaObject;
            return true;
        }
        return false;
    }
    get(ref) {
        if (this.cache[ref] != null) {
            return this.cache[ref];
        }
    }
    /**
     * The size of the cache. Indicates how many media objects are in the cache.
     */
    get size() {
        return Object.keys(this.cache).length;
    }
    getAll() {
        return Object.values(this.cache);
    }
    reset() {
        for (const ref in this.cache) {
            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
            delete this.cache[ref];
        }
    }
    *[Symbol.iterator]() {
        for (const ref in this.cache) {
            yield this.cache[ref];
        }
    }
}
exports.Cache = Cache;
/**
 * Media assets have two URI schemes: `uuid:` and `ref:`. Internally we use only
 * the `ref` scheme. This cache enables the translation from `uuid` to `ref`
 * URIs.
 */
class UriTranslator {
    constructor() {
        this.uuids = {};
    }
    /**
     * @param ref - The authority in the reference (`ref`) scheme. The prefixed
     *   scheme can be omitted.
     * @param uuid - The authority in the Universally Unique Identifier (`uuid`)
     *   scheme. The prefixed scheme can be omitted.
     *
     * @returns True, if the uri authority pair was successfully added, false
     *   if the pair was already added.
     */
    addPair(ref, uuid) {
        ref = client_media_models_1.MediaUri.removeScheme(ref);
        uuid = client_media_models_1.MediaUri.removeScheme(uuid);
        if (this.uuids[uuid] == null) {
            this.uuids[uuid] = ref;
            return true;
        }
        return false;
    }
    /**
     * Get the reference authority from the Universally Unique Identifier (uuid)
     * authority. The input must be specified without the scheme prefixes and the
     * output is prefixed with the `ref:` scheme.
     *
     * @param uuid With out the scheme prefix.
     *
     * @returns The reference authority with `ref:`
     */
    getRefFromUuid(uuid) {
        uuid = client_media_models_1.MediaUri.removeScheme(uuid);
        if (this.uuids[uuid] != null) {
            return 'ref:' + this.uuids[uuid];
        }
    }
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
    getRef(uuidOrRef, withoutFragment = false) {
        let prefix;
        const splittedUri = client_media_models_1.MediaUri.splitByFragment(uuidOrRef);
        if (splittedUri.prefix.indexOf('uuid:') === 0) {
            prefix = this.getRefFromUuid(splittedUri.prefix);
        }
        else {
            prefix = splittedUri.prefix;
        }
        if (prefix != null) {
            if (splittedUri.fragment == null || withoutFragment) {
                return prefix;
            }
            else {
                return `${prefix}#${splittedUri.fragment}`;
            }
        }
    }
    reset() {
        for (const uuid in this.uuids) {
            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
            delete this.uuids[uuid];
        }
    }
}
exports.UriTranslator = UriTranslator;
