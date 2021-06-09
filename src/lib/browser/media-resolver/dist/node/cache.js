"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetMediaCache = exports.getSamples = exports.sampleCache = exports.getMultipartSelection = exports.multiPartSelectionCache = exports.MultiPartSelectionCache = exports.getAssets = exports.assetCache = exports.AssetCache = exports.translateToSampleRef = exports.translateToAssetRef = exports.mediaUriTranslator = exports.MediaUriTranslator = exports.Cache = exports.MimeTypeShortcutCounter = void 0;
const client_media_models_1 = require("@bldr/client-media-models");
const internal_1 = require("./internal");
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
exports.MimeTypeShortcutCounter = MimeTypeShortcutCounter;
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
class MediaUriTranslator {
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
exports.MediaUriTranslator = MediaUriTranslator;
exports.mediaUriTranslator = new MediaUriTranslator();
/**
 * @param uri A asset URI in various formats.
 *
 * @returns A asset URI (without the fragment) in the `ref` scheme.
 */
function translateToAssetRef(uri) {
    return exports.mediaUriTranslator.getRef(uri, true);
}
exports.translateToAssetRef = translateToAssetRef;
/**
 * for example: translates `ref:test` into `ref:test#complete` or
 * `uuid:88ad5df3-d7f9-4e9e-9d522-e205f51eedb3` into `ref:test#complete`
 *
 * @param uri A asset or sample URI in various formats.
 *
 * @returns A sample URI in the `ref` scheme. A missing fragment is added with `#complete`.
 */
function translateToSampleRef(uri) {
    if (!uri.includes('#')) {
        uri = uri + '#complete';
    }
    return exports.mediaUriTranslator.getRef(uri);
}
exports.translateToSampleRef = translateToSampleRef;
class AssetCache extends Cache {
    add(ref, asset) {
        if (exports.mediaUriTranslator.addPair(asset.ref, asset.uuid)) {
            super.add(ref, asset);
            return true;
        }
        return false;
    }
    get(uuidOrRef) {
        const ref = exports.mediaUriTranslator.getRef(uuidOrRef);
        if (ref != null) {
            return super.get(ref);
        }
    }
}
exports.AssetCache = AssetCache;
exports.assetCache = new AssetCache();
function getAssets() {
    return exports.assetCache.getAll();
}
exports.getAssets = getAssets;
/**
 * The media asset of the multipart selection must be present in the
 * AssetCache(), the media asset must be resolved first.
 */
class MultiPartSelectionCache extends Cache {
    get(uri) {
        if (!uri.includes('#')) {
            return;
        }
        const ref = exports.mediaUriTranslator.getRef(uri);
        if (ref != null) {
            let selection = super.get(ref);
            if (selection != null) {
                return selection;
            }
            const uriRef = new client_media_models_1.MediaUri(ref);
            const asset = exports.assetCache.get(uriRef.uriWithoutFragment);
            if (asset == null) {
                throw new Error(`A client media asset must be resolved first: ${uriRef.uriWithoutFragment}`);
            }
            selection = new internal_1.MultiPartSelection(asset, ref);
            this.add(ref, selection);
            return selection;
        }
    }
    add(ref, selection) {
        super.add(ref, selection);
        return true;
    }
}
exports.MultiPartSelectionCache = MultiPartSelectionCache;
exports.multiPartSelectionCache = new MultiPartSelectionCache();
function getMultipartSelection(uri) {
    return exports.multiPartSelectionCache.get(uri);
}
exports.getMultipartSelection = getMultipartSelection;
class SampleCache extends Cache {
    get(uuidOrRef) {
        const ref = exports.mediaUriTranslator.getRef(uuidOrRef);
        if (ref != null) {
            return super.get(ref);
        }
    }
}
exports.sampleCache = new SampleCache();
function getSamples() {
    return exports.sampleCache.getAll();
}
exports.getSamples = getSamples;
function resetMediaCache() {
    exports.sampleCache.reset();
    exports.multiPartSelectionCache.reset();
    exports.assetCache.reset();
    exports.mediaUriTranslator.reset();
    internal_1.sampleShortcutManager.reset();
    internal_1.imageShortcutCounter.reset();
}
exports.resetMediaCache = resetMediaCache;
