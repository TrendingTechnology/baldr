"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultiPartSelection = exports.ClientMediaAsset = exports.imageShortcutCounter = void 0;
const core_browser_1 = require("@bldr/core-browser");
const string_format_1 = require("@bldr/string-format");
const client_media_models_1 = require("@bldr/client-media-models");
const internal_1 = require("./internal");
exports.imageShortcutCounter = new internal_1.MimeTypeShortcutCounter('i');
class ClientMediaAsset {
    /**
     * @param yaml - A raw javascript object read from the Rest API
     */
    constructor(uri, httpUrl, yaml) {
        this.uri = new client_media_models_1.MediaUri(uri);
        this.httpUrl = httpUrl;
        this.yaml = yaml;
        if (this.yaml.extension == null && this.yaml.path != null) {
            const extension = (0, string_format_1.getExtension)(this.yaml.path);
            if (extension != null) {
                this.yaml.extension = extension;
            }
        }
        if (this.yaml.extension == null) {
            throw Error('The client media assets needs a extension');
        }
        this.mimeType = client_media_models_1.mimeTypeManager.extensionToType(this.yaml.extension);
        if (this.mimeType === 'image') {
            this.shortcut = exports.imageShortcutCounter.get();
        }
        if (this.mimeType !== 'document') {
            this.htmlElement = (0, internal_1.createHtmlElement)(this.mimeType, this.httpUrl);
        }
        if (this.isPlayable) {
            this.samples = new internal_1.SampleCollection(this);
        }
        internal_1.assetCache.add(this.ref, this);
    }
    get ref() {
        return 'ref:' + this.yaml.ref;
    }
    get uuid() {
        return 'uuid:' + this.yaml.uuid;
    }
    set shortcut(value) {
        this.shortcut_ = value;
    }
    get shortcut() {
        var _a;
        if (this.shortcut_ != null) {
            return this.shortcut_;
        }
        if (((_a = this.samples) === null || _a === void 0 ? void 0 : _a.complete) != null) {
            return this.samples.complete.shortcut;
        }
    }
    get previewHttpUrl() {
        if (this.yaml.previewImage) {
            return `${this.httpUrl}_preview.jpg`;
        }
    }
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
    get isPlayable() {
        return ['audio', 'video'].includes(this.mimeType);
    }
    get isVisible() {
        return ['image', 'video'].includes(this.mimeType);
    }
    get multiPartCount() {
        if (this.yaml.multiPartCount == null) {
            return 1;
        }
        return this.yaml.multiPartCount;
    }
    getMultiPartHttpUrlByNo(no) {
        if (this.multiPartCount === 1)
            return this.httpUrl;
        if (no > this.multiPartCount) {
            throw new Error(`The asset has only ${this.multiPartCount} parts, not ${no}`);
        }
        return (0, string_format_1.formatMultiPartAssetFileName)(this.httpUrl, no);
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
        this.partNos = (0, core_browser_1.selectSubset)(this.selectionSpec, {
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
