"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetMediaCache = exports.assetCache = exports.AssetCache = exports.sampleCache = exports.mediaUriCache = exports.MediaUriCache = exports.Cache = void 0;
const sample_1 = require("./sample");
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
    getRef(uuidOrRef) {
        if (uuidOrRef.indexOf('uuid:') === 0) {
            return this.getRefFromUuid(uuidOrRef);
        }
        return uuidOrRef;
    }
    reset() {
        for (const ref in this.refs) {
            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
            delete this.refs[ref];
        }
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
        if (id != null && this.cache[id] != null) {
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
