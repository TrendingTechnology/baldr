var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as api from '@bldr/api-wrapper';
import { getConfig } from '@bldr/config';
import { makeHttpRequestInstance } from '@bldr/http-request';
import { makeSet } from '@bldr/core-browser';
import { MediaUri, findMediaUris } from '@bldr/client-media-models';
import { Asset } from './asset';
import { MultipartSelection } from './multipart';
import { UriTranslator, Cache, MimeTypeShortcutCounter } from './cache';
const config = getConfig();
class AssetCache extends Cache {
    constructor(translator) {
        super();
        this.uriTranslator = translator;
    }
    add(ref, asset) {
        if (this.uriTranslator.addPair(asset.ref, asset.uuid)) {
            super.add(ref, asset);
            return true;
        }
        return false;
    }
    get(uuidOrRef) {
        const ref = this.uriTranslator.getRef(uuidOrRef);
        if (ref != null) {
            return super.get(ref);
        }
    }
    getMultiple(uuidOrRefs) {
        if (typeof uuidOrRefs === 'string') {
            uuidOrRefs = [uuidOrRefs];
        }
        const output = [];
        for (const uuidOrRef of uuidOrRefs) {
            const asset = this.get(uuidOrRef);
            if (asset != null) {
                output.push(asset);
            }
        }
        return output;
    }
}
class MultipartSelectionCache extends Cache {
    constructor(translator) {
        super();
        this.uriTranslator = translator;
    }
    get(uuidOrRef) {
        const ref = this.uriTranslator.getRef(uuidOrRef);
        if (ref != null) {
            return super.get(ref);
        }
    }
}
class SampleCache extends Cache {
    constructor(translator) {
        super();
        this.uriTranslator = translator;
    }
    get(uuidOrRef) {
        const ref = this.uriTranslator.getRef(uuidOrRef);
        if (ref != null) {
            return super.get(ref);
        }
    }
}
/**
 * Manager to set shortcuts on three MIME types (audio, video, image).
 */
class ShortcutManager {
    constructor() {
        this.audio = new MimeTypeShortcutCounter('a');
        this.video = new MimeTypeShortcutCounter('v');
        this.image = new MimeTypeShortcutCounter('i');
    }
    setOnSample(sample) {
        if (sample.shortcut != null) {
            return;
        }
        if (sample.asset.mimeType === 'audio') {
            sample.shortcut = this.audio.get();
        }
        else if (sample.asset.mimeType === 'video') {
            sample.shortcut = this.video.get();
        }
    }
    setOnAsset(asset) {
        if (asset.shortcut != null) {
            return;
        }
        if (asset.mimeType === 'image') {
            asset.shortcut = this.image.get();
        }
    }
    reset() {
        this.audio.reset();
        this.video.reset();
        this.image.reset();
    }
}
/**
 * Resolve (get the HTTP URL and some meta informations) of a remote media
 * file by its URI. Create media elements for each media file. Create samples
 * for playable media files.
 */
export class Resolver {
    constructor() {
        this.httpRequest = makeHttpRequestInstance(config, 'automatic', '/api/media');
        this.cache = {};
        this.uriTranslator = new UriTranslator();
        this.assetCache = new AssetCache(this.uriTranslator);
        this.multipartSelectionCache = new MultipartSelectionCache(this.uriTranslator);
        this.sampleCache = new SampleCache(this.uriTranslator);
        this.shortcutManager = new ShortcutManager();
    }
    /**
     * Query the media server to get meta informations and the location of the file.
     *
     * @param uri - For example `ref:Fuer-Elise`
     * @param throwException - Throw an exception if the media URI
     *  cannot be resolved (default: `true`).
     */
    queryMediaServer(uri, throwException = true) {
        return __awaiter(this, void 0, void 0, function* () {
            const mediaUri = new MediaUri(uri);
            const cacheKey = mediaUri.uriWithoutFragment;
            if (this.cache[cacheKey] != null) {
                return this.cache[cacheKey];
            }
            const asset = yield api.getAssetByUri(uri, throwException);
            const rawRestApiAsset = asset;
            this.cache[cacheKey] = rawRestApiAsset;
            return rawRestApiAsset;
        });
    }
    /**
     * Create a new media asset. The samples are created in the constructor of
     * the media asset.
     *
     * @param uri - A media URI (Uniform Resource Identifier) with an optional
     *   fragment suffix, for example `ref:Yesterday#complete`. The fragment
     *   suffix is removed.
     * @param raw - The raw object from the REST API and YAML metadata file.
     *
     * @returns The newly created media asset.
     */
    createAsset(uri, raw) {
        const httpUrl = `${this.httpRequest.baseUrl}/${config.mediaServer.urlFillIn}/${raw.path}`;
        const asset = new Asset(uri, httpUrl, raw);
        this.assetCache.add(asset.ref, asset);
        this.shortcutManager.setOnAsset(asset);
        if (asset.samples != null) {
            for (const sample of asset.samples) {
                if (this.sampleCache.add(sample.ref, sample)) {
                    this.shortcutManager.setOnSample(sample);
                }
            }
        }
        return asset;
    }
    /**
     * Resolve (get the HTTP URL and some meta informations) of a remote media
     * file by its URI.
     *
     * @param uri - A media URI (Uniform Resource Identifier) with an optional
     *   fragment suffix, for example `ref:Yesterday#complete`. The fragment
     *   suffix is removed.
     * @param throwException - Throw an exception if the media URI
     *  cannot be resolved (default: `true`).
     */
    resolveSingle(uri, throwException = true) {
        return __awaiter(this, void 0, void 0, function* () {
            const cachedAsset = this.assetCache.get(uri);
            if (cachedAsset != null) {
                return cachedAsset;
            }
            const raw = yield this.queryMediaServer(uri, throwException);
            if (raw != null) {
                return this.createAsset(uri, raw);
            }
        });
    }
    /**
     * Resolve one or more remote media files by URIs.
     *
     * Linked media URIs are resolved recursively.
     *
     * @param uris - A single media URI or an array of media URIs.
     * @param throwException - Throw an exception if the media URI
     *  cannot be resolved (default: `true`).
     */
    resolve(uris, throwException = true) {
        return __awaiter(this, void 0, void 0, function* () {
            const mediaUris = makeSet(uris);
            const urisWithoutFragments = new Set();
            for (const uri of mediaUris) {
                urisWithoutFragments.add(MediaUri.removeFragment(uri));
            }
            const assets = [];
            // Resolve the main media URIs
            while (urisWithoutFragments.size > 0) {
                const promises = [];
                for (const uri of urisWithoutFragments) {
                    promises.push(this.resolveSingle(uri, throwException));
                    urisWithoutFragments.delete(uri);
                }
                for (const asset of yield Promise.all(promises)) {
                    if (asset != null) {
                        findMediaUris(asset.meta, urisWithoutFragments);
                        assets.push(asset);
                        // In the set urisWithoutFragments can be both ref: and uuid: URIs.
                        urisWithoutFragments.delete(asset.ref);
                        urisWithoutFragments.delete(asset.uuid);
                    }
                }
            }
            return assets;
        });
    }
    /**
     * Return a media asset. If the asset has not yet been resolved, it will be
     * resolved.
     *
     * @param uri - A media URI in the `ref` or `uuid` scheme with or without a
     * sample fragment.
     *
     * @returns A media asset or undefined.
     */
    resolveAsset(uri) {
        return __awaiter(this, void 0, void 0, function* () {
            const asset = this.assetCache.get(uri);
            if (asset != null) {
                return asset;
            }
            const assets = yield this.resolve(uri);
            if (assets.length === 1) {
                return assets[0];
            }
        });
    }
    /**
     * Return a media asset.
     *
     * @param uri - A media URI in the `ref` or `uuid` scheme with or without a
     * sample fragment.
     *
     * @returns A media asset or undefined.
     *
     * @throws If the asset is not present in the asset cache
     */
    getAsset(uri) {
        const asset = this.assetCache.get(uri);
        if (asset == null) {
            throw new Error(`The asset with the URI ${uri} couldn’t be resolved.`);
        }
        return asset;
    }
    /**
     * @returns All previously resolved media assets.
     */
    exportAssets(refs) {
        if (refs != null) {
            return this.assetCache.getMultiple(refs);
        }
        return this.assetCache.getAll();
    }
    createMultipartSelection(uri, selectionSpec) {
        return __awaiter(this, void 0, void 0, function* () {
            const assets = yield this.resolve(uri);
            const asset = assets[0];
            const multipart = new MultipartSelection(asset, selectionSpec);
            const ref = this.uriTranslator.getRef(uri);
            if (ref == null) {
                throw Error('URI translation went wrong on multipart creation.');
            }
            this.multipartSelectionCache.add(ref, multipart);
            return multipart;
        });
    }
    resolveMultipartSelection(uri) {
        return __awaiter(this, void 0, void 0, function* () {
            const mediaUri = new MediaUri(uri);
            if (mediaUri.fragment == null) {
                return;
            }
            const multipart = this.multipartSelectionCache.get(uri);
            if (multipart != null) {
                return multipart;
            }
            return yield this.createMultipartSelection(uri, mediaUri.fragment);
        });
    }
    /**
     * @throws If the URI has no fragment or if the multipart selection is
     *   not yet resolved.
     */
    getMultipartSelection(uri) {
        const mediaUri = new MediaUri(uri);
        if (mediaUri.fragment == null) {
            throw new Error(`A multipart selection requires a fragment #..., got ${uri}`);
        }
        const multipart = this.multipartSelectionCache.get(uri);
        if (multipart == null) {
            throw new Error(`The multipart selection with the URI ${uri} couldn’t be resolved.`);
        }
        return multipart;
    }
    exportMultipartSelections() {
        return this.multipartSelectionCache.getAll();
    }
    /**
     * Return a sample. If the sample has not yet been resolved, it will be
     * resolved.
     *
     * @param uri - A media URI in the `ref` or `uuid` scheme with or without a
     *   sample fragment. If the fragment is omitted, the “complete” sample is
     *   returned
     *
     * @returns A sample or undefined.
     */
    resolveSample(uri) {
        return __awaiter(this, void 0, void 0, function* () {
            const mediaUri = new MediaUri(uri);
            if (mediaUri.fragment == null) {
                uri = uri + '#complete';
            }
            const sample = this.sampleCache.get(uri);
            if (sample != null) {
                return sample;
            }
            yield this.resolve(uri);
            return this.sampleCache.get(uri);
        });
    }
    /**
     * Return a sample.
     *
     * @param uri - A media URI in the `ref` or `uuid` scheme with or without a
     *   sample fragment. If the fragment is omitted, the “complete” sample is
     *   returned
     *
     * @returns A sample or undefined.
     *
     * @throws If the sample couldn’t be resolved.
     */
    getSample(uri) {
        const mediaUri = new MediaUri(uri);
        if (mediaUri.fragment == null) {
            uri = uri + '#complete';
        }
        const sample = this.sampleCache.get(uri);
        if (sample == null) {
            throw new Error(`The sample with the URI ${uri} couldn’t be resolved.`);
        }
        return sample;
    }
    /**
     * @returns All previously resolved samples.
     */
    exportSamples() {
        return this.sampleCache.getAll();
    }
    /**
     * @param uri - A asset URI in various formats.
     *
     * @returns A asset URI (without the fragment) in the `ref` scheme.
     */
    translateToAssetRef(uri) {
        return this.uriTranslator.getRef(uri, true);
    }
    /**
     * Reset all delegated caches.
     */
    reset() {
        this.sampleCache.reset();
        this.assetCache.reset();
        this.uriTranslator.reset();
        this.shortcutManager.reset();
    }
}
export function updateMediaServer() {
    return __awaiter(this, void 0, void 0, function* () {
        yield api.updateMediaServer();
    });
}
