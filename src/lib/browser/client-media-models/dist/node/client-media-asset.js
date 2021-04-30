"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetCache = exports.ClientMediaAsset = void 0;
const core_browser_1 = require("@bldr/core-browser");
const mime_type_1 = require("./mime-type");
const media_uri_1 = require("./media-uri");
const sample_1 = require("./sample");
/**
 * Hold various data of a media file as class properties.
 *
 * If a media file has a property with the name `multiPartCount` set, it is a
 * multi part asset. A multi part asset can be restricted to one part only by a
 * URI fragment (for example `#2`). The URI `id:Score#2` resolves always to the
 * HTTP URL `http:/example/media/Score_no02.png`.
 */
class ClientMediaAsset {
    /**
     * @param meta - A raw javascript object read from the Rest API
     */
    constructor(uri, httpUrl, meta) {
        this.uri = new media_uri_1.MediaUri(uri);
        this.httpUrl = httpUrl;
        this.meta = meta;
        if (this.meta.extension == null && this.meta.filename != null) {
            const extension = core_browser_1.getExtension(this.meta.filename);
            if (extension != null) {
                this.meta.extension = extension;
            }
        }
        if (this.meta.extension == null) {
            throw Error('The client media assets needs a extension');
        }
        this.mimeType = mime_type_1.mimeTypeManager.extensionToType(this.meta.extension);
        this.samples = new sample_1.SampleCollection(this);
    }
    /**
     * The URI using the `id` scheme.
     */
    get id() {
        return this.meta.id;
    }
    /**
     * The URI using the `uuid` scheme.
     */
    get uuid() {
        return this.meta.uuid;
    }
    /**
     * Store the file name from a HTTP URL.
     *
     * @param {String} url
     */
    // filenameFromHTTPUrl (url) {
    //   this.filename = url.split('/').pop()
    // }
    /**
     * Merge an object into the class object.
     *
     * @param {object} properties - Add an object to the class properties.
     */
    // addProperties (properties) {
    //   for (const property in properties) {
    //     this[property] = properties[property]
    //   }
    // }
    get titleSafe() {
        if (this.meta.title != null)
            return this.meta.title;
        if (this.meta.filename != null)
            return this.meta.filename;
        return this.uri.raw;
    }
    /**
     * True if the media file is playable, for example an audio or a video file.
     */
    get isPlayable() {
        return ['audio', 'video'].includes(this.mimeType);
    }
    /**
     * True if the media file is visible, for example an image or a video file.
     */
    get isVisible() {
        return ['image', 'video'].includes(this.mimeType);
    }
}
exports.ClientMediaAsset = ClientMediaAsset;
class AssetCache {
    constructor() {
        this.cache = {};
        this.mediaUriCache = new media_uri_1.MediaUriCache();
    }
    add(asset) {
        if (this.mediaUriCache.addPair(asset.id, asset.uuid)) {
            this.cache[asset.id] = asset;
            return true;
        }
        return false;
    }
    get(uuidOrId) {
        const id = this.mediaUriCache.getId(uuidOrId);
        if (id != null && this.cache[id] != null) {
            return this.cache[id];
        }
    }
    getAll() {
        return Object.values(this.cache);
    }
}
exports.AssetCache = AssetCache;
