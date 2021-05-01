import type { AssetType } from '@bldr/type-definitions';
import { MediaUri } from './media-uri';
import { SampleCollection } from './sample';
/**
 * Hold various data of a media file as class properties.
 *
 * If a media file has a property with the name `multiPartCount` set, it is a
 * multi part asset. A multi part asset can be restricted to one part only by a
 * URI fragment (for example `#2`). The URI `ref:Score#2` resolves always to the
 * HTTP URL `http:/example/media/Score_no02.png`.
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
    htmlElement?: object;
    /**
     * The media type, for example `image`, `audio` or `video`.
     */
    mimeType: string;
    httpUrl: string;
    samples?: SampleCollection;
    /**
     * @param meta - A raw javascript object read from the Rest API
     */
    constructor(uri: string, httpUrl: string, meta: AssetType.RestApiRaw);
    /**
     * The URI using the `ref` scheme.
     */
    get ref(): string;
    /**
     * The URI using the `uuid` scheme.
     */
    get uuid(): string;
    /**
     * Store the file name from a HTTP URL.
     *
     * @param {String} url
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
    /**
     * All plain text collected from the properties except some special properties.
     *
     * @type {string}
     */
    /**
     * The vue router link of the component `MediaAsset.vue`.
     *
     * Examples:
     * * `#/media/localfile/013b3960-af60-4184-9d87-7c3e723550b8`
     *
     * @type {string}
     */
    /**
     * Sort properties alphabetically aand move some important ones to the
     * begining of the array.
     *
     * @return {Array}
     */
    /**
     * The actual multi part asset count. If the multi part asset is restricted
     * the method returns 1, else the count of all the parts.
     */
    get multiPartCount(): number;
    /**
     * Retrieve the HTTP URL of the multi part asset by the part number.
     *
     * @param The part number starts with 1.
     */
    getMultiPartHttpUrlByNo(no: number): string;
}
