import { Sample, Asset, RestApiRaw } from './types';
import { MediaUri } from '@bldr/client-media-models';
import { Cache } from './cache';
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
