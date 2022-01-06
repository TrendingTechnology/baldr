/**
 * Following properties are moved into the sample “complete”: `startTime`,
 * `duration`, `endTime`, `fadeIn`, `fadeOut`, `shortcut`
 */
export interface SampleYamlFormat {
    /**
     * for example `Theme 1`
     */
    title?: string;
    /**
     * without spaces, only ASCII, for example `theme_1`
     */
    ref?: string;
    /**
     * The start time in seconds or as a duration string like `1:23:45` = 1 hour
     * 23 minutes and 45 seconds, for example `61.123435`.
     */
    startTime?: number | string;
    /**
     * The duration in seconds or as a duration string like `1:23:45` = 1 hour 23
     * minutes and 45 seconds, mutually exclusive to `endTime`, for example `12`.
     */
    duration?: number | string;
    /**
     * The end time in seconds or as a duration string like `1:23:45` = 1 hour 23
     * minutes and 45 seconds, mutually exclusive to `duration` `163.12376`.
     */
    endTime?: number | string;
    /**
     * The fade in time in seconds or as a duration string like `1:23:45` = 1 hour
     * 23 minutes and 45 seconds for example `5`.
     */
    fadeIn?: number | string;
    /**
     * The fade out time in seconds or as a duration string like `1:23:45` = 1
     * hour 23 minutes and 45 seconds for example `5`.
     */
    fadeOut?: number | string;
    /**
     * A custom shortcut for mousetrap, for example `o 1`.
     */
    shortcut?: string;
}
export interface Cache<T> {
    add: (ref: string, mediaObject: T) => boolean;
    get: (ref: string) => T | undefined;
    /**
     * The size of the cache. Indicates how many media objects are in the cache.
     */
    size: number;
    getAll: () => T[];
    reset: () => void;
}
/**
 * The state of the current playback.
 */
export declare type PlaybackState = 'started' | 'fadein' | 'playing' | 'fadeout' | 'stopped';
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
export interface Sample {
    /**
     * The parent media file object.
     *
     */
    /**
     * Raw data coming from the YAML format.
     */
    yaml: SampleYamlFormat;
    /**
     * The corresponding HTML media element, a object of the
     * corresponding `<audio/>` or `<video/>` element.
     */
    htmlElement: HTMLMediaElement;
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
    playbackState: PlaybackState;
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
     * The current time of the sample. It starts from zero.
     */
    currentTimeSec: number;
    /**
     * Time in seconds to fade in.
     */
    fadeInSec: number;
    /**
     * Time in seconds to fade out.
     */
    fadeOutSec: number;
    /**
     * The duration of the sample in seconds. If the duration is set on the
     * sample, it is the same as `sample.durationSec_`.
     */
    durationSec: number;
    /**
     * The remaining duration of the sample in seconds.
     */
    durationRemainingSec: number;
    /**
     * A number between 0 and 1. 0: the sample starts from the beginning. 1:
     * the sample reaches the end.
     */
    progress: number;
    volume: number;
    /**
     * Fade in. Set the volume to 0 and reach after a time intervale, specified
     * with `duration` the `targetVolume.`
     *
     * @param targetVolume - End volume value of the fade in process. A
     *   number from 0 - 1.
     * @param duration - in seconds
     */
    fadeIn: (targetVolume: number, duration?: number) => Promise<void>;
    /**
     * Start and play a sample from the beginning.
     *
     * @param targetVolume - End volume value of the fade in process. A
     *   number from 0 - 1.
     */
    start: (targetVolume: number) => void;
    /**
     * Play a sample from `startTimeSec`.
     *
     * @param targetVolume - End volume value of the fade in process. A
     *   number from 0 - 1.
     * @param startTimeSec - Position in the sample from where to play
     *   the sample
     */
    play: (targetVolume: number, startTimeSec?: number, fadeInSec?: number) => void;
    /**
     * @param duration - in seconds
     */
    fadeOut: (duration?: number) => Promise<void>;
    /**
     * Stop the playback of a sample and reset the current play position to the
     * beginning of the sample. If the sample is a video, show the poster
     * (the preview image) again by triggering the `load()` method of the
     * corresponding media element.
     *
     * @param fadeOutSec - Duration in seconds to fade out the sample.
     */
    stop: (fadeOutSec?: number) => Promise<void>;
    /**
     * Pause the sample at the current position and set the video element to
     * opacity 0. The properties `mediaElementCurrentTimeSec_` and
     * `mediaElementCurrentVolume_` are set or
     * updated.
     */
    pause: () => Promise<void>;
    /**
     * Toggle between `sample.pause()` and `sample.play()`. If a sample is loaded
     * start this sample.
     */
    toggle: (targetVolume: number) => void;
    /**
     * Jump forwards.
     *
     * @param interval - Time interval in seconds.
     */
    forward: (interval: number) => void;
    /**
     * Jump backwards.
     *
     * interval - Time interval in seconds.
     */
    backward: (interval: number) => void;
}
export interface SampleCollection extends Cache<Sample> {
}
