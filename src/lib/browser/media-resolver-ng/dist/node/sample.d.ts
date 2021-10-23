import { MediaResolverTypes } from '@bldr/type-definitions';
/**
 * A sample (snippet, sprite) of a media file which can be played. A sample
 * has typically a start time and a duration. If the start time is missing, the
 * media file gets played from the beginning. If the duration is missing, the
 * whole media file gets played.
 *
 * ```
 *                  currentTimeSec
 *                  |
 *  fadeIn          |        fadeOut
 *         /|-------+------|\           <- mediaElementCurrentVolume_
 *      /   |       |      |   \
 *   /      |       |      |     \
 * #|#######|#######|######|#####|#### <- mediaElement
 *  ^                            ^
 *  startTimeSec                 endTimeSec
 *                         ^
 *                         |
 *                         fadeOutStartTime
 *
 *  | <-      durationSec      ->|
 * ```
 */
export interface SampleSpec {
    /**
     * The parent media file object.
     *
     */
    asset: MediaResolverTypes.ClientMediaAsset;
    /**
     * Raw data coming from the YAML format.
     */
    yaml: MediaResolverTypes.SampleYamlFormat;
    /**
     * The start time in seconds. The sample is played from this start time
     * using the `mediaElement` of the `asset`. It is the “zero” second
     * for the sample.
     */
    startTimeSec: number;
    /**
     * The shortcut key stroke combination to launch the sample for example `a 1`, `v 1` or `i 1`.
     */
    shortcut?: string;
    /**
     * The reference of the sample. The reference is used to build the URI of the sample, for
     * example `uri#reference`: `ref:Beethoven#complete`
     */
    ref: string;
    /**
     * The title of the sample. For example `komplett`, `Hook-Line`.
     */
    title: string;
    /**
     * If the sample is the complete media file get the title of the media file.
     * For example `Glocken (Das große Tor von Kiew)`
     */
    titleSafe: string;
    /**
     * Combined value build from `this.asset.meta.artist` and `this.asset.meta.composer`.
     */
    artistSafe?: string;
    /**
     * Combined value build from `this.asset.yaml.creationDate` and
     * `this.asset.yaml.year`.
     */
    yearSafe?: string;
    /**
     * Time in seconds to fade in.
     */
    fadeInSec: number;
    /**
     * Time in seconds to fade out.
     */
    fadeOutSec: number;
}
export declare class Sample implements SampleSpec {
    asset: MediaResolverTypes.ClientMediaAsset;
    yaml: MediaResolverTypes.SampleYamlFormat;
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
    constructor(asset: MediaResolverTypes.ClientMediaAsset, yaml: MediaResolverTypes.SampleYamlFormat);
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
