import { MediaUri } from '@bldr/client-media-models';
import { MediaDataTypes } from '@bldr/type-definitions';
import { Cache } from './cache';
import { Sample } from './sample';
export declare class SampleCollection extends Cache<Sample> {
    private readonly asset;
    constructor(asset: Asset);
    get complete(): Sample | undefined;
    private addSample;
    /**
     * Gather informations to build the default sample “complete”.
     */
    private gatherYamlFromRoot;
    private addFromAsset;
}
/**
 * Hold various data of a media file as class properties.
 *
 * If a media file has a property with the name `multiPartCount`, it is a
 * multipart asset. A multipart asset can be restricted to one part only by a
 * URI fragment (for example `#2`). The URI `ref:Score#2` resolves always to the
 * HTTP URL `http:/example/media/Score_no02.png`.
 */
export declare class Asset {
    /**
     * A raw javascript object read from the YAML files
     * (`*.extension.yml`)
     */
    meta: MediaDataTypes.AssetMetaData;
    uri: MediaUri;
    /**
     * The keyboard shortcut to launch the media asset. At the moment only used by
     * images.
     */
    private shortcut_?;
    samples?: SampleCollection;
    /**
     * The media type, for example `image`, `audio` or `video`.
     */
    mimeType: string;
    /**
     * HTTP Uniform Resource Locator, for example
     * `http://localhost/media/Lieder/i/Ich-hab-zu-Haus-ein-Gramophon/HB/Ich-hab-zu-Haus-ein-Grammophon.m4a`.
     */
    httpUrl: string;
    /**
     * @param meta - A raw javascript object read from the Rest API
     */
    constructor(uri: string, httpUrl: string, meta: MediaDataTypes.AssetMetaData);
    /**
     * The reference authority of the URI using the `ref` scheme. The returned
     * string is prefixed with `ref:`.
     */
    get ref(): string;
    /**
     * The UUID authority of the URI using the `uuid` scheme. The returned
     * string is prefixed with `uuid:`.
     */
    get uuid(): string;
    set shortcut(value: string | undefined);
    /**
     * @inheritdoc
     */
    get shortcut(): string | undefined;
    /**
     * Each media asset can have a preview image. The suffix `_preview.jpg`
     * is appended on the path. For example
     * `http://localhost/media/Lieder/i/Ich-hab-zu-Haus-ein-Gramophon/HB/Ich-hab-zu-Haus-ein-Grammophon.m4a_preview.jpg`
     */
    get previewHttpUrl(): string | undefined;
    /**
     * Each meda asset can be associated with a waveform image. The suffix `_waveform.png`
     * is appended on the HTTP URL. For example
     * `http://localhost/media/Lieder/i/Ich-hab-zu-Haus-ein-Gramophon/HB/Ich-hab-zu-Haus-ein-Grammophon.m4a_waveform.png`
     */
    get waveformHttpUrl(): string | undefined;
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
     * The number of parts of a multipart media asset.
     */
    get multiPartCount(): number;
    /**
     * Retrieve the HTTP URL of the multi part asset by the part number.
     *
     * @param The part number starts with 1.
     */
    getMultiPartHttpUrlByNo(no: number): string;
}
