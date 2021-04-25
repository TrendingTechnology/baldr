"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Resolver = exports.httpRequest = void 0;
const http_request_1 = require("@bldr/http-request");
const client_media_models_1 = require("@bldr/client-media-models");
const core_browser_1 = require("@bldr/core-browser");
const config_1 = require("@bldr/config");
exports.httpRequest = http_request_1.makeHttpRequestInstance(config_1.default, 'automatic', '/api/media');
/**
 * Resolve (get the HTTP URL and some meta informations) of a remote media
 * file by its URI. Resolve a local file. The local files have to dropped
 * in the application. Create media elements for each media file. Create samples
 * for playable media files.
 */
class Resolver {
    constructor() {
        this.cache = {};
    }
    /**
     * @param field - For example `id` or `uuid`
     * @param search - For example `Fuer-Elise_HB`
     * @param throwException - Throw an exception if the media URI
     *  cannot be resolved (default: `true`).
     *
     * @returns {Object} - See {@link https://github.com/axios/axios#response-schema}
     */
    queryMediaServer(uri) {
        return __awaiter(this, void 0, void 0, function* () {
            const mediaUri = new client_media_models_1.MediaUri(uri);
            const field = mediaUri.scheme;
            const search = mediaUri.authority;
            const cacheKey = mediaUri.uriWithoutFragment;
            if (this.cache[cacheKey] != null) {
                return this.cache[cacheKey];
            }
            const response = yield exports.httpRequest.request({
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
                throw new Error(`Media with the ${field} ”${search}” couldn’t be resolved.`);
            }
            const rawRestApiAsset = response.data;
            this.cache[cacheKey] = rawRestApiAsset;
            return rawRestApiAsset;
        });
    }
    /**
     * Create samples for each playable media file. By default each media file
     * has one sample called “complete”.
     *
     * @param {module:@bldr/media-client.ClientMediaAsset} asset - The
     *   `asset` object, a client side representation of a media asset.
     *
     * @returns {module:@bldr/media-client~Sample[]}
     */
    // createSamples_ (asset) {
    //   if (asset.isPlayable) {
    //     // First sample of each playable media file is the “complete” track.
    //     const completeSampleSpec = {
    //       title: 'komplett',
    //       id: 'complete',
    //       startTime: 0
    //     }
    //     for (const prop of ['startTime', 'duration', 'endTime', 'fadeOut', 'fadeIn', 'shortcut']) {
    //       if (asset[prop]) {
    //         completeSampleSpec[prop] = asset[prop]
    //         delete asset[prop]
    //       }
    //     }
    //     // Store all sample specs in a object to check if there is already a
    //     // sample with the id “complete”.
    //     let sampleSpecs = null
    //     if (asset.samples) {
    //       sampleSpecs = {}
    //       for (const sampleSpec of asset.samples) {
    //         sampleSpecs[sampleSpec.id] = sampleSpec
    //       }
    //     }
    //     // Create the sample “complete”.
    //     let sample
    //     const samples = {}
    //     if (!sampleSpecs || (sampleSpecs && !('complete' in sampleSpecs))) {
    //       sample = new Sample(asset, completeSampleSpec)
    //       samples[sample.uri] = sample
    //     }
    //     // Add further samples specifed in the yaml section.
    //     if (sampleSpecs) {
    //       for (const sampleId in sampleSpecs) {
    //         const sampleSpec = sampleSpecs[sampleId]
    //         sample = new Sample(asset, sampleSpec)
    //         samples[sample.uri] = sample
    //       }
    //     }
    //     for (const sampleUri in samples) {
    //       samples[sampleUri].mediaElement = createMediaElement(asset)
    //       store.commit('media/addSample', samples[sampleUri])
    //     }
    //     return samples
    //   }
    // }
    /**
     * @private
     *
     * @param {String} uri - For example `uuid:... id:...`
     * @param {Object} data - Object from the REST API.
     *
     * @returns {module:@bldr/media-client.ClientMediaAsset}
     */
    // createAssetFromRestData_ (uri, data): ClientMediaAsset {
    //   let asset
    //   data.uri = uri
    //   if (data.multiPartCount) {
    //     // asset = new MultiPartAsset({ uri })
    //     // store.commit('media/addMultiPartUri', asset.uriRaw)
    //   } else {
    //     asset = new ClientMediaAsset({ uri })
    //     console.log(new ClientMediaAsset(data))
    //   }
    //   extractMediaUrisRecursive(data, this.linkedUris)
    //   asset.addProperties(data)
    //   asset.httpUrl = this.resolveHttpUrl_(asset)
    //   if (asset.previewImage) {
    //     asset.previewHttpUrl = `${asset.httpUrl}_preview.jpg`
    //   }
    //   return asset
    // }
    /**
     * @private
     *
     * @param {Object} file - A file object, see
     *  {@link https://developer.mozilla.org/de/docs/Web/API/File}
     *
     * @returns {module:@bldr/media-client.ClientMediaAsset}
     */
    // createAssetFromFileObject_ (file) {
    //   if (mimeTypeManager.isAsset(file.name)) {
    //     // blob:http:/localhost:8080/8c00d9e3-6ff1-4982-a624-55f125b5c0c0
    //     const httpUrl = URL.createObjectURL(file)
    //     // 8c00d9e3-6ff1-4982-a624-55f125b5c0c0
    //     const uuid = httpUrl.substr(httpUrl.length - 36)
    //     // We use the uuid instead of the file name. The file name can contain
    //     // whitespaces and special characters. A uuid is  more reliable.
    //     const uri = `localfile:${uuid}`
    //     return new ClientMediaAsset({
    //       uri: uri,
    //       httpUrl: httpUrl,
    //       filename: file.name
    //     })
    //   }
    // }
    /**
     * @param {module:@bldr/media-client.ClientMediaAsset} asset
     */
    // addMediaElementToAsset (asset) {
    //   asset.type = mimeTypeManager.extensionToType(asset.extension)
    //   // After type
    //   if (asset.type !== 'document') {
    //     asset.mediaElement = createMediaElement(asset)
    //   }
    //   const samples = this.createSamples_(asset)
    //   if (samples) {
    //     asset.samples = samples
    //   }
    // }
    /**
     * Resolve (get the HTTP URL and some meta informations) of a remote media
     * file by its URI.
     */
    resolveSingle(uri) {
        return __awaiter(this, void 0, void 0, function* () {
            const raw = yield this.queryMediaServer(uri);
            const httpUrl = `${exports.httpRequest.baseUrl}/${config_1.default.mediaServer.urlFillIn}/${raw.path}`;
            return new client_media_models_1.ClientMediaAsset(uri, httpUrl, raw);
        });
    }
    /**
     * Resolve one or more remote media files by URIs.
     *
     * Linked media URIs are resolved recursively.
     *
     * @param uris - A single media URI or an array of media URIs.
     */
    resolve(uris) {
        return __awaiter(this, void 0, void 0, function* () {
            const mediaUris = core_browser_1.makeSet(uris);
            const assets = [];
            // Resolve the main media URIs
            while (mediaUris.size > 0) {
                const promises = [];
                for (const mediaUri of mediaUris) {
                    promises.push(this.resolveSingle(mediaUri));
                }
                for (const asset of yield Promise.all(promises)) {
                    client_media_models_1.findMediaUris(asset.meta, mediaUris);
                    assets.push(asset);
                    mediaUris.delete(asset.uri.raw);
                }
            }
            return assets;
        });
    }
}
exports.Resolver = Resolver;
