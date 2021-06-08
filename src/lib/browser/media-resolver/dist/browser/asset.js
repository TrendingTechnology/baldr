import { getExtension, formatMultiPartAssetFileName, selectSubset } from '@bldr/core-browser';
import { mimeTypeManager, MediaUri } from '@bldr/client-media-models';
import { assetCache, createHtmlElement, SampleCollection, MimeTypeShortcutCounter } from './internal';
export const imageShortcutCounter = new MimeTypeShortcutCounter('i');
/**
 * Hold various data of a media file as class properties.
 *
 * If a media file has a property with the name `multiPartCount` set, it is a
 * multi part asset. A multi part asset can be restricted to one part only by a
 * URI fragment (for example `#2`). The URI `ref:Score#2` resolves always to the
 * HTTP URL `http:/example/media/Score_no02.png`.
 */
export class ClientMediaAsset {
    /**
     * @param yaml - A raw javascript object read from the Rest API
     */
    constructor(uri, httpUrl, yaml) {
        /**
         * To be able to distinguish the old and the new version of the class.
         *
         * TODO remove
         */
        this.ng = true;
        this.uri = new MediaUri(uri);
        this.httpUrl = httpUrl;
        this.yaml = yaml;
        if (this.yaml.extension == null && this.yaml.filename != null) {
            const extension = getExtension(this.yaml.filename);
            if (extension != null) {
                this.yaml.extension = extension;
            }
        }
        if (this.yaml.extension == null) {
            throw Error('The client media assets needs a extension');
        }
        this.mimeType = mimeTypeManager.extensionToType(this.yaml.extension);
        if (this.mimeType === 'image') {
            this.shortcut = imageShortcutCounter.get();
        }
        if (this.mimeType !== 'document') {
            this.htmlElement = createHtmlElement(this.mimeType, this.httpUrl);
        }
        if (this.isPlayable) {
            this.samples = new SampleCollection(this);
        }
        assetCache.add(this.ref, this);
    }
    /**
     * The reference authority of the URI using the `ref` scheme. The returned
     * string is prefixed with `ref:`.
     */
    get ref() {
        return 'ref:' + this.yaml.ref;
    }
    /**
     * The UUID authority of the URI using the `uuid` scheme. The returned
     * string is prefixed with `uuid:`.
     */
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
    /**
     * Each media asset can have a preview image. The suffix `_preview.jpg`
     * is appended on the path. For example
     * `http://localhost/media/Lieder/i/Ich-hab-zu-Haus-ein-Gramophon/HB/Ich-hab-zu-Haus-ein-Grammophon.m4a_preview.jpg`
     */
    get previewHttpUrl() {
        if (this.yaml.previewImage) {
            return `${this.httpUrl}_preview.jpg`;
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
        return formatMultiPartAssetFileName(this.httpUrl, no);
    }
}
/**
 * A multipart asset can be restricted in different ways. This class holds the
 * data of the restriction (for example all parts, only a single part, a
 * subset of parts). A multi part asset can be restricted to one part only by a
 * URI fragment (for example `#2`). The URI `ref:Score#2` resolves always to the
 * HTTP URL `http:/example/media/Score_no02.png`.
 */
export class MultiPartSelection {
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
        this.partNos = selectSubset(this.selectionSpec, { elementsCount: this.asset.multiPartCount, firstElementNo: 1 });
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
