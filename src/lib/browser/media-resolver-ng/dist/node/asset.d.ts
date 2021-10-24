import { Sample, Asset, RestApiRaw } from './types';
import { MediaUri } from '@bldr/client-media-models';
import { Cache } from './cache';
/**
 * A multipart asset can be restricted in different ways. This class holds the
 * data of the restriction (for example all parts, only a single part, a
 * subset of parts). A multi part asset can be restricted to one part only by a
 * URI fragment (for example `#2`). The URI `ref:Score#2` resolves always to the
 * HTTP URL `http:/example/media/Score_no02.png`.
 */
export declare class MultiPartSelection {
    selectionSpec: string;
    asset: ClientMediaAsset;
    partNos: number[];
    /**
     * The URI of the media asset suffixed with the selection specification.
     * `ref:Beethoven-9th#2,3,4,6-8`. A URI without a selection specification
     * means all parts.
     */
    uri: string;
    /**
     * @param selectionSpec - Can be a URI, everthing after `#`, for
     * example `ref:Song-2#2-5` -> `2-5`
     */
    constructor(asset: ClientMediaAsset, selectionSpec: string);
    /**
     * The URI using the `ref` authority.
     */
    get ref(): string;
    /**
     * The number of parts of a multipart media asset.
     */
    get multiPartCount(): number;
    /**
     * Used for the preview to fake that this class is a normal asset.
     */
    get httpUrl(): string;
    /**
     * Retrieve the HTTP URL of the multi part asset by the part number.
     *
     * @param The part number starts with 1. We set a default value,
     * because no is sometimes undefined when only one part is selected. The
     * router then creates no step url (not /slide/1/step/1) but (/slide/1)
     */
    getMultiPartHttpUrlByNo(no?: number): string;
}
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
export declare class ClientMediaAsset implements Asset {
    /**
     * @inheritdoc
     */
    yaml: RestApiRaw;
    uri: MediaUri;
    /**
     * The keyboard shortcut to launch the media asset. At the moment only used by
     * images.
     */
    private shortcut_?;
    samples?: SampleCollection;
    /**
     * @inheritdoc
     */
    mimeType: string;
    /**
     * @inheritdoc
     */
    httpUrl: string;
    /**
     * @param yaml - A raw javascript object read from the Rest API
     */
    constructor(uri: string, httpUrl: string, yaml: RestApiRaw);
    /**
     * @inheritdoc
     */
    get ref(): string;
    /**
     * @inheritdoc
     */
    get uuid(): string;
    set shortcut(value: string | undefined);
    /**
     * @inheritdoc
     */
    get shortcut(): string | undefined;
    /**
     * @inheritdoc
     */
    get previewHttpUrl(): string | undefined;
    /**
     * @inheritdoc
     */
    get waveformHttpUrl(): string | undefined;
    get titleSafe(): string;
    /**
     * @inheritdoc
     */
    get isPlayable(): boolean;
    /**
     * @inheritdoc
     */
    get isVisible(): boolean;
    /**
     * @inheritdoc
     */
    get multiPartCount(): number;
    /**
     * @inheritdoc
     */
    getMultiPartHttpUrlByNo(no: number): string;
}
