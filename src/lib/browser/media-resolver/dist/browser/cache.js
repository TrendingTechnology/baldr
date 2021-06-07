import { MediaUri } from '@bldr/client-media-models';
import { imageShortcutCounter, MultiPartSelection, sampleShortcutManager } from './internal';
/**
 * This class manages the counter for one MIME type (`audio`, `image` and `video`).
 */
export class MimeTypeShortcutCounter {
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
 * Media assets have two URI schemes: `uuid:` and `ref:`. Internally we use only
 * the `ref` scheme. This cache enables the translation from `uuid` to `ref`
 * URIs.
 */
export class MediaUriTranslator {
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
        ref = MediaUri.removeScheme(ref);
        uuid = MediaUri.removeScheme(uuid);
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
        uuid = MediaUri.removeScheme(uuid);
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
        const splittedUri = MediaUri.splitByFragment(uuidOrRef);
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
export const mediaUriTranslator = new MediaUriTranslator();
/**
 * @param uri A asset URI in various formats.
 *
 * @returns A asset URI (without the fragment) in the `ref` scheme.
 */
export function translateToAssetRef(uri) {
    return mediaUriTranslator.getRef(uri, true);
}
/**
 * for example: translates `ref:test` into `ref:test#complete` or
 * `uuid:88ad5df3-d7f9-4e9e-9522-e205f51eedb3` into `ref:test#complete`
 *
 * @param uri A asset or sample URI in various formats.
 *
 * @returns A sample URI in the `ref` scheme. A missing fragment is added with `#complete`.
 */
export function translateToSampleRef(uri) {
    if (!uri.includes('#')) {
        uri = uri + '#complete';
    }
    return mediaUriTranslator.getRef(uri);
}
class SampleCache extends Cache {
    get(uuidOrRef) {
        const ref = mediaUriTranslator.getRef(uuidOrRef);
        if (ref != null) {
            return super.get(ref);
        }
    }
}
export const sampleCache = new SampleCache();
export class AssetCache extends Cache {
    add(ref, asset) {
        if (mediaUriTranslator.addPair(asset.ref, asset.uuid)) {
            super.add(ref, asset);
            return true;
        }
        return false;
    }
    get(uuidOrRef) {
        const ref = mediaUriTranslator.getRef(uuidOrRef);
        if (ref != null) {
            return super.get(ref);
        }
    }
}
export const assetCache = new AssetCache();
/**
 * The media asset of the multipart selection must be present in the
 * AssetCache(), the media asset must be resolved first.
 */
export class MultiPartSelectionCache extends Cache {
    get(uri) {
        if (!uri.includes('#')) {
            throw new Error(`A multipart selection asset must have a fragment in its URI: ${uri}`);
        }
        const ref = mediaUriTranslator.getRef(uri);
        if (ref != null) {
            let selection = super.get(ref);
            if (selection != null) {
                return selection;
            }
            const uriRef = new MediaUri(ref);
            const asset = assetCache.get(uriRef.uriWithoutFragment);
            if (asset == null) {
                throw new Error(`A client media asset must be resolved first: ${uriRef.uriWithoutFragment}`);
            }
            selection = new MultiPartSelection(asset, uriRef.fragment);
            this.add(ref, selection);
            return selection;
        }
    }
    add(ref, selection) {
        super.add(ref, selection);
        return true;
    }
}
export const multiPartSelectionCache = new MultiPartSelectionCache();
export function getMultipartSelection(uri) {
    return multiPartSelectionCache.get(uri);
}
export function resetMediaCache() {
    sampleCache.reset();
    multiPartSelectionCache.reset();
    assetCache.reset();
    mediaUriTranslator.reset();
    sampleShortcutManager.reset();
    imageShortcutCounter.reset();
}
