import { getExtension } from '@bldr/core-browser';
import { mimeTypeManager } from './mime-type';
import { MediaUri } from './media-uri';
import { SampleCollection } from './sample';
import { createHtmlElement } from './html-elements';
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
     * @param meta - A raw javascript object read from the Rest API
     */
    constructor(uri, httpUrl, meta) {
        this.uri = new MediaUri(uri);
        this.httpUrl = httpUrl;
        this.meta = meta;
        if (this.meta.extension == null && this.meta.filename != null) {
            const extension = getExtension(this.meta.filename);
            if (extension != null) {
                this.meta.extension = extension;
            }
        }
        if (this.meta.extension == null) {
            throw Error('The client media assets needs a extension');
        }
        this.mimeType = mimeTypeManager.extensionToType(this.meta.extension);
        this.samples = new SampleCollection(this);
        if (this.mimeType !== 'document') {
            this.htmlElement = createHtmlElement(this.mimeType, this.httpUrl);
        }
    }
    /**
     * The URI using the `ref` scheme.
     */
    get ref() {
        return this.meta.ref;
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
