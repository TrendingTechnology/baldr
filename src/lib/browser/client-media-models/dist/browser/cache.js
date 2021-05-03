import { shortcutManager } from './sample';
export class Cache {
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
/**
 * Media assets have two URIs: uuid:... and ref:...
 */
export class MediaUriCache {
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
export const mediaUriCache = new MediaUriCache();
class SampleCache extends Cache {
}
export const sampleCache = new SampleCache();
export class AssetCache extends Cache {
    add(ref, asset) {
        if (mediaUriCache.addPair(asset.ref, asset.uuid)) {
            super.add(ref, asset);
            return true;
        }
        return false;
    }
    get(uuidOrRef) {
        const id = mediaUriCache.getRef(uuidOrRef);
        if (id != null && this.cache[id] != null) {
            return super.get(id);
        }
    }
}
export const assetCache = new AssetCache();
export function resetMediaCache() {
    sampleCache.reset();
    assetCache.reset();
    mediaUriCache.reset();
    shortcutManager.reset();
}
