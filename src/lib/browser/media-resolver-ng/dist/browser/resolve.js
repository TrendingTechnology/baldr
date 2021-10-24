var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { makeHttpRequestInstance } from '@bldr/http-request';
import { makeSet } from '@bldr/core-browser';
import { MediaUri, findMediaUris } from '@bldr/client-media-models';
import config from '@bldr/config';
import { ClientMediaAsset } from './asset';
import { UriTranslator, Cache } from './cache';
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
        this.sampleCache = new SampleCache(this.uriTranslator);
        this.assetCache = new AssetCache(this.uriTranslator);
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
            const field = mediaUri.scheme;
            const search = mediaUri.authority;
            const cacheKey = mediaUri.uriWithoutFragment;
            if (this.cache[cacheKey] != null) {
                return this.cache[cacheKey];
            }
            const response = yield this.httpRequest.request({
                url: 'query',
                method: 'get',
                params: {
                    type: 'assets',
                    method: 'exactMatch',
                    field: field,
                    search: search
                }
            });
            if (response == null || response.status !== 200 || response.data == null) {
                if (throwException) {
                    throw new Error(`Media with the ${field} ”${search}” couldn’t be resolved.`);
                }
            }
            else {
                const rawRestApiAsset = response.data;
                this.cache[cacheKey] = rawRestApiAsset;
                return rawRestApiAsset;
            }
        });
    }
    /**
     * Resolve (get the HTTP URL and some meta informations) of a remote media
     * file by its URI.
     *
     * @param uri A media URI (Uniform Resource Identifier) with an optional
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
                const httpUrl = `${this.httpRequest.baseUrl}/${config.mediaServer.urlFillIn}/${raw.path}`;
                return new ClientMediaAsset(uri, httpUrl, raw);
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
                        findMediaUris(asset.yaml, urisWithoutFragments);
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
}
