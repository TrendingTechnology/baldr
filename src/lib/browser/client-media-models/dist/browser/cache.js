import { shortcutManager } from './sample';
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
export class SampleCache {
    constructor() {
        this.cache = {};
    }
    add(sample) {
        if (this.cache[sample.uriRef] == null) {
            this.cache[sample.uriRef] = sample;
            return true;
        }
        return false;
    }
    getAll() {
        return Object.values(this.cache);
    }
    reset() {
        for (const uriRef in this.cache) {
            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
            delete this.cache[uriRef];
        }
    }
}
export const sampleCache = new SampleCache();
export class AssetCache {
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
        this.mediaUriCache.reset();
        for (const ref in this.cache) {
            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
            delete this.cache[ref];
        }
    }
}
export const assetCache = new AssetCache();
export function resetMediaCache() {
    assetCache.reset();
    shortcutManager.reset();
}
