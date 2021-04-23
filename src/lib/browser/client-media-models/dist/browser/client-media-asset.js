import { getExtension } from '@bldr/core-browser';
import { mimeTypeManager } from './mime-type';
import { MediaUri } from './media-uri';
/**
 * Hold various data of a media file as class properties.
 *
 * If a media file has a property with the name `multiPartCount` set, it is a
 * multi part asset. A multi part asset can be restricted to one part only by a
 * URI fragment (for example `#2`). The URI `id:Score#2` resolves always to the
 * HTTP URL `http:/example/media/Score_no02.png`.
 *
 * @property {string} path - The relative path on the HTTP server, for example
 *   `composer/Haydn_Joseph.jpg`.
 * @property {string} filename - The file name, for example `Haydn_Joseph.jpg`.
 * @property {string} extension - The file extension, for example `jpg`.
 * @property {string} id - An identifier, for example `Haydn_Joseph`.
 * @property {string} previewHttpUrl - Each media file can have a preview image.
 *   On the path is `_preview.jpg` appended.
 * @property {string} shortcut - The keyboard shortcut to play the media.
 * @property {Object} samples - An object of Sample instances.
 * @property {Number} multiPartCount - The of count of parts if the media file
 *   is a multi part asset.
 * @property {String} cover - An media URI of a image to use a preview image
 *   for mainly audio files. Video files are also supported.
 */
export class ClientMediaAssetNg {
    /**
     * @param raw - A raw javascript object read from the YAML files
     * (`*.extension.yml`)
     */
    constructor(raw) {
        this.raw = raw;
        if (raw.uri == null) {
            throw new Error('Every client media asset needs a uri property.');
        }
        this.uri = new MediaUri(this.raw.uri);
        if (this.raw.extension == null && this.raw.filename != null) {
            const extension = getExtension(this.raw.filename);
            if (extension != null) {
                this.raw.extension = extension;
            }
        }
        if (this.raw.extension == null) {
            throw Error('The client media assets needs a extension');
        }
        this.mimeType = mimeTypeManager.extensionToType(this.raw.extension);
    }
    /**
     * The URI using the `id` authority.
     *
     * @returns {String}
     */
    // get uriId () {
    //   return `id:${this.id}`
    // }
    /**
     * The URI using the `uuid` authority.
     *
     * @returns {String}
     */
    // get uriUuid () {
    //   return `uuid:${this.uuid}`
    // }
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
        if (this.raw.title != null)
            return this.raw.title;
        if (this.raw.filename != null)
            return this.raw.filename;
        return this.raw.uri;
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
