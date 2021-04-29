import type { AssetType } from '@bldr/type-definitions';
import { MediaUri } from './media-uri';
import { Sample } from './sample';
/**
 * Hold various data of a media file as class properties.
 *
 * If a media file has a property with the name `multiPartCount` set, it is a
 * multi part asset. A multi part asset can be restricted to one part only by a
 * URI fragment (for example `#2`). The URI `id:Score#2` resolves always to the
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
    mediaElement?: object;
    /**
     * The media type, for example `image`, `audio` or `video`.
     */
    mimeType: string;
    httpUrl: string;
    samples?: Sample[];
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
     * Create samples for each playable media file. By default each media file
     * has one sample called “complete”.
     */
    private createSamples;
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
export declare class AssetCache {
    private cache;
    private readonly mediaUriCache;
    constructor();
    add(asset: ClientMediaAsset): boolean;
    get(uuidOrId: string): ClientMediaAsset | undefined;
    getAll(): ClientMediaAsset[];
}
