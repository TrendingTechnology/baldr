import type { AssetType } from '@bldr/type-definitions';
import { ClientMediaAsset } from './client-media-asset';
/**
 * The state of the current playback.
 *
 * - started
 * - fadein
 * - playing
 * - fadeout
 * - stopped
 */
declare type PlaybackState = 'started' | 'fadein' | 'playing' | 'fadeout' | 'stopped';
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
export declare class Sample {
    /**
     * We fade in very short and smoothly to avoid audio artefacts.
     */
    defaultFadeInSec: number;
    /**
     * We never stop. Instead we fade out very short and smoothly.
     */
    defaultFadeOutSec: number;
    /**
     * Number of milliseconds to wait before the media file is played.
     */
    defaultPlayDelayMsec: number;
    /**
     * The parent media file object.
     *
     */
    asset: ClientMediaAsset;
    /**
     * The corresponding HTML media element, a object of the
     * corresponding `<audio/>` or `<video/>` element.
     */
    htmlElement: HTMLMediaElement;
    /**
     * The title of the sample. For example `komplett`, `Hook-Line`.
     */
    title: string;
    /**
     * The ID of the sample. The ID is used to build the URI of the sample, for
     * example `uri#id`: `id:Beethoven#complete`
     */
    id: string;
    /**
     * The URI of the sample in the format `uri#id`: for example
     * `id:Beethoven#complete`
     */
    uri: string;
    /**
     * The start time in seconds. The sample is played from this start time
     * using the `mediaElement` of the `asset`. It is the “zero” second
     * for the sample.
     */
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
    /**
     * The current volume of the parent media Element. This value gets stored
     * when the sample is paused. It is needed to restore the volume.
     */
    private mediaElementCurrentVolume;
    /**
     * The current time of the parent media Element. This value gets stored
     * when the sample is paused.
     */
    private mediaElementCurrentTimeSec;
    /**
     * The actual shortcut. If `shortcutCustom` is set, it is the same as this
     * value.
     */
    shortcut?: number;
    /**
     * The shortcut number. 1 means: To play the sample type in “a 1” if it
     * is a audio file or “v 1” if it is a video file.
     */
    shortcutNo?: number;
    /**
     * A custom shortcut, for example “k 1”
     */
    shortcutCustom?: string;
    private readonly interval;
    private readonly timeOut;
    private readonly customEventsManager;
    playbackState: PlaybackState;
    constructor(asset: ClientMediaAsset, { title, id, startTime, fadeIn, duration, fadeOut, endTime, shortcut }: AssetType.SampleYamlFormat);
    /**
     * The URI using the `id` authority.
     */
    get uriId(): string;
    /**
     * The URI using the `uuid` authority.
     */
    get uriUuid(): string;
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
    /**
     * Convert strings to numbers, so we can use them as seconds.
     */
    private toSec;
    /**
     * The current time of the sample. It starts from zero.
     */
    get currentTimeSec(): number;
    /**
     * Time in seconds to fade in.
     */
    get fadeInSec(): number;
    /**
     * Time in seconds to fade out.
     */
    get fadeOutSec(): number;
    /**
     * In how many milliseconds we have to start a fade out process.
     */
    private get fadeOutStartTimeMsec_();
    /**
     * The duration of the sample in seconds. If the duration is set on the
     * sample, it is the same as `sample.durationSec_`.
     */
    get durationSec(): number;
    /**
     * The remaining duration of the sample in seconds.
     */
    get durationRemainingSec(): number;
    /**
     * A number between 0 and 1. 0: the sample starts from the beginning. 1:
     * the sample reaches the end.
     */
    get progress(): number;
    get volume(): number;
    /**
     * Set the volume and simultaneously the opacity of a video element, to be
     * able to fade out or fade in a video and a audio file.
     */
    set volume(value: number);
    /**
     * Fade in. Set the volume to 0 and reach after a time intervale, specified
     * with `duration` the `targetVolume.`
     *
     * @param targetVolume - End volume value of the fade in process. A
     *   number from 0 - 1.
     * @param duration - in seconds
     */
    fadeIn(targetVolume?: number, duration?: number): Promise<void>;
    /**
     * Start and play a sample from the beginning.
     *
     * @param targetVolume - End volume value of the fade in process. A
     *   number from 0 - 1.
     */
    start(targetVolume: number): void;
    /**
     * Play a sample from `startTimeSec`.
     *
     * @param targetVolume - End volume value of the fade in process. A
     *   number from 0 - 1.
     * @param startTimeSec - Position in the sample from where to play
     *   the sample
     */
    play(targetVolume: number, startTimeSec?: number, fadeInSec?: number): void;
    /**
     * Schedule when the fade out process has to start.
     * Always fade out at the end. Maybe the samples are cut without a
     * fade out.
     */
    private scheduleFadeOut;
    /**
     * @param duration - in seconds
     */
    fadeOut(duration?: number): Promise<void>;
    /**
     * Stop the playback of a sample and reset the current play position to the
     * beginning of the sample. If the sample is a video, show the poster
     * (the preview image) again by triggering the `load()` method of the
     * corresponding media element.
     *
     * @param fadeOutSec - Duration in seconds to fade out the sample.
     */
    stop(fadeOutSec?: number): Promise<void>;
    /**
     * Pause the sample at the current position and set the video element to
     * opacity 0. The properties `mediaElementCurrentTimeSec_` and
     * `mediaElementCurrentVolume_` are set or
     * updated.
     */
    pause(): Promise<void>;
    /**
     * Toggle between `sample.pause()` and `sample.play()`. If a sample is loaded
     * start this sample.
     */
    toggle(targetVolume?: number): void;
    /**
     * Jump to a new time position.
     */
    private jump;
    /**
     * Jump forwards.
     *
     * @param interval - Time interval in seconds.
     */
    forward(interval?: number): void;
    /**
     * Jump backwards.
     *
     * interval - Time interval in seconds.
     */
    backward(interval?: number): void;
}
export {};
