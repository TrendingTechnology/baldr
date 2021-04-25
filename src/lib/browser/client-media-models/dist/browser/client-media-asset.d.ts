import type { AssetType } from '@bldr/type-definitions';
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
export declare class ClientMediaAsset {
    /**
     * A raw javascript object read from the YAML files
     * (`*.extension.yml`)
     */
    meta: AssetType.RestApiRaw;
    uri: MediaUri;
    /**
     * The keyboard shortcut to play the media
     */
    shortcut?: string;
    /**
     * The HTMLMediaElement of the media file.
     */
    mediaElement?: object;
    /**
     * The media type, for example `image`, `audio` or `video`.
     */
    mimeType: string;
    httpUrl: string;
    /**
     * @param meta - A raw javascript object read from the Rest API
     */
    constructor(uri: string, httpUrl: string, meta: AssetType.RestApiRaw);
    /**
     * The URI using the `id` scheme.
     */
    get id(): string;
    /**
     * The URI using the `uuid` scheme.
     */
    get uuid(): string;
    /**
     * Store the file name from a HTTP URL.
     *
     * @param {String} url
     */
    /**
     * Merge an object into the class object.
     *
     * @param {object} properties - Add an object to the class properties.
     */
    get titleSafe(): string;
    /**
     * True if the media file is playable, for example an audio or a video file.
     */
    get isPlayable(): boolean;
    /**
     * True if the media file is visible, for example an image or a video file.
     */
    get isVisible(): boolean;
}
