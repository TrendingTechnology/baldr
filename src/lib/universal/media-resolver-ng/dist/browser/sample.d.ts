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
    startTimeSec: number;
    /**
     * Use the getter function `sample.fadeInSec`
     */
    private readonly fadeInSec_?;
    /**
     * Use the getter function `sample.fadeOutSec`
     */
    private readonly fadeOutSec_?;
    /**
     * @inheritdoc
     */
    shortcut?: string;
    /**
     * @inheritdoc
     */
    durationSec?: number;
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
    /**
     * @inheritdoc
     */
    get fadeInSec(): number;
    /**
     * @inheritdoc
     */
    get fadeOutSec(): number;
}
