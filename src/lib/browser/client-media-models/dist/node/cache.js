"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetMediaCache = exports.assetCache = exports.AssetCache = exports.sampleCache = exports.mediaUriCache = exports.MediaUriCache = exports.Cache = void 0;
const sample_1 = require("./sample");
const media_uri_1 = require("./media-uri");
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
class MediaUriCache {
    constructor() {
        this.uuids = {};
    }
    /**
     *
     * @param ref The authority in the reference (`ref`) scheme. The prefixed
     *   scheme can be omitted.
     * @param uuid The authority in the Universally Unique Identifier (`uuid`)
     *   scheme. The prefixed scheme can be omitted.
     *
     * @returns True, if the uri authority pair was successfully added, false
     *   if the pair was already added.
     */
    addPair(ref, uuid) {
        ref = media_uri_1.MediaUri.removeScheme(ref);
        uuid = media_uri_1.MediaUri.removeScheme(uuid);
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
        uuid = media_uri_1.MediaUri.removeScheme(uuid);
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
    getRef(uuidOrRef) {
        let prefix;
        const splittedUri = media_uri_1.MediaUri.splitByFragment(uuidOrRef);
        if (splittedUri.prefix.indexOf('uuid:') === 0) {
            prefix = this.getRefFromUuid(splittedUri.prefix);
        }
        else {
            prefix = splittedUri.prefix;
        }
        if (prefix != null) {
            if (splittedUri.fragment == null) {
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
exports.MediaUriCache = MediaUriCache;
exports.mediaUriCache = new MediaUriCache();
class SampleCache extends Cache {
}
exports.sampleCache = new SampleCache();
class AssetCache extends Cache {
    add(ref, asset) {
        if (exports.mediaUriCache.addPair(asset.ref, asset.uuid)) {
            super.add(ref, asset);
            return true;
        }
        return false;
    }
    get(uuidOrRef) {
        const id = exports.mediaUriCache.getRef(uuidOrRef);
        if (id != null) {
            return super.get(id);
        }
    }
}
exports.AssetCache = AssetCache;
exports.assetCache = new AssetCache();
function resetMediaCache() {
    exports.sampleCache.reset();
    exports.assetCache.reset();
    exports.mediaUriCache.reset();
    sample_1.shortcutManager.reset();
}
exports.resetMediaCache = resetMediaCache;
