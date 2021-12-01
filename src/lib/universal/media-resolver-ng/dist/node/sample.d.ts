import { Sample, SampleYamlFormat, Asset } from './types';
export declare class SampleData implements Sample {
    /**
     * @inheritdoc
     */
    asset: Asset;
    /**
     * @inheritdoc
     */
    yaml: SampleYamlFormat;
    /**
     * @inheritdoc
     */
    shortcut?: string;
    /**
     * @inheritdoc
     */
    durationSec?: number;
    /**
     * @inheritdoc
     */
    startTimeSec: number;
    /**
     * @inheritdoc
     */
    readonly fadeInSec: number;
    /**
     * @inheritdoc
     */
    readonly fadeOutSec: number;
    constructor(asset: Asset, yaml: SampleYamlFormat);
    /**
     * Convert strings to numbers, so we can use them as seconds.
     */
    private convertToSeconds;
    /**
     * @inheritdoc
     */
    get ref(): string;
    /**
     * @inheritdoc
     */
    get title(): string;
    /**
     * @inheritdoc
     */
    get titleSafe(): string;
    /**
     * @inheritdoc
     */
    get artistSafe(): string | undefined;
    /**
     * @inheritdoc
     */
    get yearSafe(): string | undefined;
}
