import { Sample, SampleYamlFormat, Asset } from './types';
export declare class SampleData implements Sample {
    asset: Asset;
    yaml: SampleYamlFormat;
    startTimeSec: number;
    /**
     * Use the getter function `sample.fadeInSec`
     */
    private readonly fadeInSec_?;
    /**
     * Use the getter function `sample.fadeOutSec`
     */
    private readonly fadeOutSec_?;
    shortcut?: string;
    constructor(asset: Asset, yaml: SampleYamlFormat);
    /**
     * Convert strings to numbers, so we can use them as seconds.
     */
    private toSec;
    get ref(): string;
    get title(): string;
    get titleSafe(): string;
    get artistSafe(): string | undefined;
    get yearSafe(): string | undefined;
    get fadeInSec(): number;
    get fadeOutSec(): number;
}
