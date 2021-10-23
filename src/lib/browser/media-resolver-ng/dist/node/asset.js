"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetCache = exports.MultiPartSelection = exports.ClientMediaAsset = void 0;
const core_browser_1 = require("@bldr/core-browser");
const client_media_models_1 = require("@bldr/client-media-models");
const cache_1 = require("./cache");
class ClientMediaAsset {
    /**
     * @param yaml - A raw javascript object read from the Rest API
     */
    constructor(uri, httpUrl, yaml) {
        this.uri = new client_media_models_1.MediaUri(uri);
        this.httpUrl = httpUrl;
        this.yaml = yaml;
        if (this.yaml.extension == null && this.yaml.filename != null) {
            const extension = core_browser_1.getExtension(this.yaml.filename);
            if (extension != null) {
                this.yaml.extension = extension;
            }
        }
        if (this.yaml.extension == null) {
            throw Error('The client media assets needs a extension');
        }
        this.mimeType = client_media_models_1.mimeTypeManager.extensionToType(this.yaml.extension);
    }
    /**
     * @inheritdoc
     */
    get ref() {
        return 'ref:' + this.yaml.ref;
    }
    /**
     * @inheritdoc
     */
    get uuid() {
        return 'uuid:' + this.yaml.uuid;
    }
    set shortcut(value) {
        this.shortcut_ = value;
    }
    /**
     * @inheritdoc
     */
    get shortcut() {
        if (this.shortcut_ != null) {
            return this.shortcut_;
        }
    }
    /**
     * @inheritdoc
     */
    get previewHttpUrl() {
        if (this.yaml.previewImage) {
            return `${this.httpUrl}_preview.jpg`;
        }
    }
    /**
     * @inheritdoc
     */
    get waveformHttpUrl() {
        if (this.yaml.hasWaveform) {
            return `${this.httpUrl}_waveform.png`;
        }
    }
    get titleSafe() {
        if (this.yaml.title != null) {
            return this.yaml.title;
        }
        if (this.yaml.filename != null) {
            return this.yaml.filename;
        }
        return this.uri.raw;
    }
    /**
     * @inheritdoc
     */
    get isPlayable() {
        return ['audio', 'video'].includes(this.mimeType);
    }
    /**
     * @inheritdoc
     */
    get isVisible() {
        return ['image', 'video'].includes(this.mimeType);
    }
    /**
     * @inheritdoc
     */
    get multiPartCount() {
        if (this.yaml.multiPartCount == null) {
            return 1;
        }
        return this.yaml.multiPartCount;
    }
    /**
     * @inheritdoc
     */
    getMultiPartHttpUrlByNo(no) {
        if (this.multiPartCount === 1)
            return this.httpUrl;
        if (no > this.multiPartCount) {
            throw new Error(`The asset has only ${this.multiPartCount} parts, not ${no}`);
        }
        return core_browser_1.formatMultiPartAssetFileName(this.httpUrl, no);
    }
}
exports.ClientMediaAsset = ClientMediaAsset;
/**
 * A multipart asset can be restricted in different ways. This class holds the
 * data of the restriction (for example all parts, only a single part, a
 * subset of parts). A multi part asset can be restricted to one part only by a
 * URI fragment (for example `#2`). The URI `ref:Score#2` resolves always to the
 * HTTP URL `http:/example/media/Score_no02.png`.
 */
class MultiPartSelection {
    /**
     * @param selectionSpec - Can be a URI, everthing after `#`, for
     * example `ref:Song-2#2-5` -> `2-5`
     */
    constructor(asset, selectionSpec) {
        this.selectionSpec = selectionSpec.replace(/^.*#/, '');
        this.asset = asset;
        if (this.selectionSpec == null) {
            this.uri = this.asset.uri.raw;
        }
        else {
            this.uri = `${this.asset.uri.raw}#${this.selectionSpec}`;
        }
        this.partNos = core_browser_1.selectSubset(this.selectionSpec, {
            elementsCount: this.asset.multiPartCount,
            firstElementNo: 1
        });
    }
    /**
     * The URI using the `ref` authority.
     */
    get ref() {
        if (this.selectionSpec == null) {
            return this.asset.yaml.ref;
        }
        else {
            return `${this.asset.yaml.ref}#${this.selectionSpec}`;
        }
    }
    /**
     * The number of parts of a multipart media asset.
     */
    get multiPartCount() {
        return this.partNos.length;
    }
    /**
     * Used for the preview to fake that this class is a normal asset.
     */
    get httpUrl() {
        return this.getMultiPartHttpUrlByNo(1);
    }
    /**
     * Retrieve the HTTP URL of the multi part asset by the part number.
     *
     * @param The part number starts with 1. We set a default value,
     * because no is sometimes undefined when only one part is selected. The
     * router then creates no step url (not /slide/1/step/1) but (/slide/1)
     */
    getMultiPartHttpUrlByNo(no = 1) {
        return this.asset.getMultiPartHttpUrlByNo(this.partNos[no - 1]);
    }
}
exports.MultiPartSelection = MultiPartSelection;
class AssetCache extends cache_1.Cache {
    constructor(translator) {
        super();
        this.mediaUriTranslator = translator;
    }
    add(ref, asset) {
        if (this.mediaUriTranslator.addPair(asset.ref, asset.uuid)) {
            super.add(ref, asset);
            return true;
        }
        return false;
    }
    get(uuidOrRef) {
        const ref = this.mediaUriTranslator.getRef(uuidOrRef);
        if (ref != null) {
            return super.get(ref);
        }
    }
}
exports.AssetCache = AssetCache;
