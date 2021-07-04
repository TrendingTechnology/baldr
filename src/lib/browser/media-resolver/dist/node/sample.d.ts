import type { MediaResolverTypes } from '@bldr/type-definitions';
import { Cache } from './internal';
export declare class SampleShortcutManager {
    private readonly audio;
    private readonly video;
    constructor();
    addShortcut(sample: Sample): void;
    reset(): void;
}
export declare const sampleShortcutManager: SampleShortcutManager;
export declare class Sample implements MediaResolverTypes.Sample {
    asset: MediaResolverTypes.ClientMediaAsset;
    yaml: MediaResolverTypes.SampleYamlFormat;
    htmlElement: HTMLMediaElement;
    /**
     * The current volume of the parent media Element. This value gets stored
     * when the sample is paused. It is needed to restore the volume.
     */
    private htmlElementCurrentVolume;
    /**
      * The current time of the parent media Element. This value gets stored
      * when the sample is paused.
      */
    private htmlElementCurrentTimeSec;
    startTimeSec: number;
    /**
     * Use the getter functions `sample.durationSec`.
     */
    private readonly durationSec_?;
    /**
     * Use the getter function `sample.fadeInSec`
     */
    private readonly fadeInSec_?;
    /**
     * Use the getter function `sample.fadeOutSec`
     */
    private readonly fadeOutSec_?;
    shortcut?: string;
    private readonly interval;
    private readonly timeOut;
    private readonly events;
    playbackState: MediaResolverTypes.PlaybackState;
    constructor(asset: MediaResolverTypes.ClientMediaAsset, yaml: MediaResolverTypes.SampleYamlFormat);
    get ref(): string;
    get title(): string;
    get titleSafe(): string;
    get artistSafe(): string | undefined;
    get yearSafe(): string | undefined;
    /**
     * Convert strings to numbers, so we can use them as seconds.
     */
    private toSec;
    get currentTimeSec(): number;
    get fadeInSec(): number;
    get fadeOutSec(): number;
    /**
     * In how many milliseconds we have to start a fade out process.
     */
    private get fadeOutStartTimeMsec();
    get durationSec(): number;
    get durationRemainingSec(): number;
    get progress(): number;
    get volume(): number;
    /**
     * Set the volume and simultaneously the opacity of a video element, to be
     * able to fade out or fade in a video and a audio file.
     */
    set volume(value: number);
    fadeIn(targetVolume?: number, duration?: number): Promise<void>;
    start(targetVolume: number): void;
    play(targetVolume: number, startTimeSec?: number, fadeInSec?: number): void;
    /**
     * Schedule when the fade out process has to start.
     * Always fade out at the end. Maybe the samples are cut without a
     * fade out.
     */
    private scheduleFadeOut;
    fadeOut(duration?: number): Promise<void>;
    stop(fadeOutSec?: number): Promise<void>;
    pause(): Promise<void>;
    toggle(targetVolume?: number): void;
    /**
     * Jump to a new time position.
     */
    private jump;
    forward(interval?: number): void;
    backward(interval?: number): void;
}
export declare class SampleCollection extends Cache<Sample> {
    private readonly asset;
    constructor(asset: MediaResolverTypes.ClientMediaAsset);
    get complete(): Sample | undefined;
    private addSample;
    /**
     * Gather informations to build the default sample “complete”.
     */
    private gatherYamlFromRoot;
    private addFromAsset;
}
