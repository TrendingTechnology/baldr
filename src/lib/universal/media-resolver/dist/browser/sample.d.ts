import { MediaDataTypes } from '@bldr/type-definitions';
import { Asset } from './asset';
/**
 * A sample (snippet, sprite) of a media asset which can be played. A sample
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
export declare class Sample {
    /**
     * The parent media asset.
     */
    asset: Asset;
    /**
     * Raw data coming from the YAML format.
     */
    meta: MediaDataTypes.SampleMetaData;
    /**
     * The shortcut key stroke combination to launch the sample for example `a 1`, `v 1` or `i 1`.
     */
    shortcut?: string;
    /**
     * The duration of the sample in seconds.
     */
    durationSec?: number;
    /**
     * The start time in seconds. The sample is played from this start time
     * using the `mediaElement` of the `asset`. It is the “zero” second
     * for the sample.
     */
    startTimeSec: number;
    /**
     * Time in seconds to fade in.
     */
    readonly fadeInSec: number;
    /**
     * Time in seconds to fade out.
     */
    readonly fadeOutSec: number;
    constructor(asset: Asset, meta: MediaDataTypes.SampleMetaData);
    /**
     * Convert strings to numbers, so we can use them as seconds.
     */
    private convertToSeconds;
    /**
     * The sample reference is prefixed with `ref:` and suffixed with a sample
     * fragment (`#fragment`), for example `ref:Fuer-Elise#complete`.
     */
    get ref(): string;
    /**
     * The title of the sample. For example `komplett`, `Hook-Line`.
     */
    get title(): string;
    /**
     * If the sample is the complete media file get the title of the media file.
     * For example `Glocken (Das große Tor von Kiew)`
     */
    get titleSafe(): string;
    /**
     * Combined value build from `this.asset.meta.artist` and `this.asset.meta.composer`.
     */
    get artistSafe(): string | undefined;
    /**
     * Combined value build from `this.asset.meta.creationDate` and
     * `this.asset.meta.year`.
     */
    get yearSafe(): string | undefined;
}
