"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetMediaCache = exports.assetCache = exports.AssetCache = exports.MediaUriCache = void 0;
const sample_1 = require("./sample");
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
class AssetCache {
    constructor() {
        this.cache = {};
        this.mediaUriCache = new MediaUriCache();
    }
    add(asset) {
        if (this.mediaUriCache.addPair(asset.ref, asset.uuid)) {
            this.cache[asset.ref] = asset;
            return true;
        }
        return false;
    }
    get(uuidOrRef) {
        const id = this.mediaUriCache.getRef(uuidOrRef);
        if (id != null && this.cache[id] != null) {
            return this.cache[id];
        }
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
}
exports.AssetCache = AssetCache;
exports.assetCache = new AssetCache();
function resetMediaCache() {
    exports.assetCache.reset();
    sample_1.shortcutManager.reset();
}
exports.resetMediaCache = resetMediaCache;
