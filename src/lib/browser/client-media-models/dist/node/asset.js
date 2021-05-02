"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultiPartSelection = exports.ClientMediaAsset = void 0;
const core_browser_1 = require("@bldr/core-browser");
const mime_type_1 = require("./mime-type");
const media_uri_1 = require("./media-uri");
const sample_1 = require("./sample");
const html_elements_1 = require("./html-elements");
const cache_1 = require("./cache");
/**
 * Hold various data of a media file as class properties.
 *
 * If a media file has a property with the name `multiPartCount` set, it is a
 * multi part asset. A multi part asset can be restricted to one part only by a
 * URI fragment (for example `#2`). The URI `ref:Score#2` resolves always to the
 * HTTP URL `http:/example/media/Score_no02.png`.
 */
class ClientMediaAsset {
    /**
     * @param yaml - A raw javascript object read from the Rest API
     */
    constructor(uri, httpUrl, yaml) {
        this.uri = new media_uri_1.MediaUri(uri);
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
        this.mimeType = mime_type_1.mimeTypeManager.extensionToType(this.yaml.extension);
        if (this.mimeType !== 'document') {
            this.htmlElement = html_elements_1.createHtmlElement(this.mimeType, this.httpUrl);
        }
        if (this.isPlayable) {
            this.samples = new sample_1.SampleCollection(this);
        }
        cache_1.assetCache.add(this.yaml.ref, this);
    }
    /**
     * The URI using the `ref` scheme.
     */
    get ref() {
        return this.yaml.ref;
    }
    /**
     * The URI using the `uuid` scheme.
     */
    get uuid() {
        return this.yaml.uuid;
    }
    /**
     * Store the file name from a HTTP URL.
     *
     * @param {String} url
     */
    // filenameFromHTTPUrl (url) {
    //   this.filename = url.split('/').pop()
    // }
    get titleSafe() {
        if (this.yaml.title != null)
            return this.yaml.title;
        if (this.yaml.filename != null)
            return this.yaml.filename;
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
    /**
     * All plain text collected from the properties except some special properties.
     *
     * @type {string}
     */
    // get plainText () {
    //   const output = []
    //   const excludedProperties = [
    //     'mimeType',
    //     'extension',
    //     'filename',
    //     'httpUrl',
    //     'id',
    //     'mediaElement',
    //     'categories',
    //     'musicbrainzRecordingId',
    //     'musicbrainzWorkId',
    //     'path',
    //     'previewHttpUrl',
    //     'previewImage',
    //     'samples',
    //     'mainImage',
    //     'shortcut',
    //     'size',
    //     'source',
    //     'timeModified',
    //     'type',
    //     'uri',
    //     'uriAuthority',
    //     'uriRaw',
    //     'uriScheme',
    //     'uuid',
    //     'wikidata',
    //     'youtube'
    //   ]
    //   for (const property in this) {
    //     if (this[property] && !excludedProperties.includes(property)) {
    //       output.push(this[property])
    //     }
    //   }
    //   return convertHtmlToPlainText(output.join(' | '))
    // }
    /**
     * The vue router link of the component `MediaAsset.vue`.
     *
     * Examples:
     * * `#/media/localfile/013b3960-af60-4184-9d87-7c3e723550b8`
     *
     * @type {string}
     */
    // get routerLink () {
    //   return `#/media/${this.uriScheme}/${this.uriAuthority}`
    // }
    /**
     * Sort properties alphabetically aand move some important ones to the
     * begining of the array.
     *
     * @return {Array}
     */
    // get propertiesSorted () {
    //   let properties = Object.keys(this)
    //   properties = properties.sort()
    //   function moveOnFirstPosition (properties, property) {
    //     properties = properties.filter(item => item !== property)
    //     properties.unshift(property)
    //     return properties
    //   }
    //   for (const property of ['id', 'uri', 'title']) {
    //     properties = moveOnFirstPosition(properties, property)
    //   }
    //   return properties
    // }
    /**
     * The actual multi part asset count. If the multi part asset is restricted
     * the method returns 1, else the count of all the parts.
     */
    get multiPartCount() {
        if (this.yaml.multiPartCount == null)
            return 1;
        return this.yaml.multiPartCount;
    }
    /**
     * Retrieve the HTTP URL of the multi part asset by the part number.
     *
     * @param The part number starts with 1.
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
     * @param selectionSpec - Can be a uri, everthing after `#`, for
     * example `ref:Song-2#2-5` -> `2-5`
     */
    constructor(asset, selectionSpec) {
        // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
        if (selectionSpec != null && (selectionSpec === null || selectionSpec === void 0 ? void 0 : selectionSpec.includes('#')) && typeof selectionSpec === 'string') {
            this.selectionSpec = selectionSpec.replace(/^.*#/, '');
        }
        this.asset = asset;
        if (this.selectionSpec == null) {
            this.uri = this.asset.uri.raw;
        }
        else {
            this.uri = `${this.asset.uri.raw}#${this.selectionSpec}`;
        }
        this.partNos = core_browser_1.selectSubset(this.selectionSpec, { elementsCount: this.asset.multiPartCount, firstElementNo: 1 });
    }
    /**
     * The URI using the `ref` authority.
     */
    get uriRef() {
        if (this.selectionSpec == null) {
            return this.asset.yaml.ref;
        }
        else {
            return `${this.asset.yaml.ref}#${this.selectionSpec}`;
        }
    }
    /**
     * The URI using the `uuid` authority.
     */
    get uriUuid() {
        if (this.selectionSpec == null) {
            return this.asset.yaml.uuid;
        }
        else {
            return `${this.asset.yaml.uuid}#${this.selectionSpec}`;
        }
    }
    get partCount() {
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
