import { RestApiRaw } from './asset';
import { MediaUri } from './client-media-models';
interface Cache<T> {
    add(ref: string, mediaObject: T): boolean;
    get(ref: string): T | undefined;
    /**
     * The size of the cache. Indicates how many media objects are in the cache.
     */
    size: number;
    getAll(): T[];
    reset(): void;
}
export interface Sample {
}
export interface SampleCollection extends Cache<Sample> {
}
/**
 * Hold various data of a media file as class properties.
 *
 * If a media file has a property with the name `multiPartCount` set, it is a
 * multi part asset. A multi part asset can be restricted to one part only by a
 * URI fragment (for example `#2`). The URI `ref:Score#2` resolves always to the
 * HTTP URL `http:/example/media/Score_no02.png`.
 */
export interface ClientMediaAsset {
    /**
     * A raw javascript object read from the YAML files
     * (`*.extension.yml`)
     */
    yaml: RestApiRaw;
    uri: MediaUri;
    /**
     * The HTMLMediaElement of the media file.
     */
    htmlElement?: object;
    /**
     * The media type, for example `image`, `audio` or `video`.
     */
    mimeType: string;
    /**
     * HTTP Uniform Resource Locator, for example
     * `http://localhost/media/Lieder/i/Ich-hab-zu-Haus-ein-Gramophon/HB/Ich-hab-zu-Haus-ein-Grammophon.m4a`.
     */
    httpUrl: string;
    samples?: SampleCollection;
    /**
     * The reference authority of the URI using the `ref` scheme. The returned
     * string is prefixed with `ref:`.
     */
    ref: string;
    /**
     * The UUID authority of the URI using the `uuid` scheme. The returned
     * string is prefixed with `uuid:`.
     */
    uuid: string;
    shortcut?: string;
    /**
     * Each media asset can have a preview image. The suffix `_preview.jpg`
     * is appended on the path. For example
     * `http://localhost/media/Lieder/i/Ich-hab-zu-Haus-ein-Gramophon/HB/Ich-hab-zu-Haus-ein-Grammophon.m4a_preview.jpg`
     */
    previewHttpUrl?: string;
    /**
     * Each meda asset can be associated with a waveform image. The suffix `_waveform.png`
     * is appended on the HTTP URL. For example
     * `http://localhost/media/Lieder/i/Ich-hab-zu-Haus-ein-Gramophon/HB/Ich-hab-zu-Haus-ein-Grammophon.m4a_waveform.png`
     */
    waveformHttpUrl?: string;
    titleSafe: string;
    /**
     * True if the media file is playable, for example an audio or a video file.
     */
    isPlayable: boolean;
    /**
     * True if the media file is visible, for example an image or a video file.
     */
    isVisible: boolean;
    /**
     * The number of parts of a multipart media asset.
     */
    multiPartCount: number;
    /**
     * Retrieve the HTTP URL of the multi part asset by the part number.
     *
     * @param The part number starts with 1.
     */
    getMultiPartHttpUrlByNo(no: number): string;
}
export {};
