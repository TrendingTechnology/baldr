import { MediaUri } from '@bldr/client-media-models';
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
/**
 * The metadata YAML file format.
 *
 * This interface corresponds to the structure of the YAML files
 * `*.extension.yml`. The most frequently used properties are explicitly
 * specified.
 *
 * ```yml
 * ---
 * ref: Schuetz-Freue_HB_Freue-dich
 * uuid: 02dcf8df-8f34-4b0d-b121-32b0f54cfd74
 * categories: 'composition,recording'
 * title: 'Freue dich des Weibes deiner Jugend, SWV 453 (verm. um 1620)'
 * wikidata: Q90698578
 * composer: Heinrich Schütz
 * imslp: 'Freue_dich_des_Weibes_deiner_Jugend,_SWV_453_(Schütz,_Heinrich)'
 * musicbrainz_work_id: 0f6faed6-4892-4b43-855f-e3fe8f49bffa
 * ```
 */
export interface YamlFormat {
    /**
     * A reference string, for example `Haydn_Joseph`.
     */
    ref: string;
    uuid: string;
    title: string;
    categories?: string;
    /**
     * This property is moved into the sample “complete”. The start time in
     * seconds or as a duration string like `1:23:45` = 1 hour 23 minutes and 45
     * seconds, for example `61.123435`.
     */
    startTime?: number;
    /**
     * This property is moved into the sample “complete”. The duration in seconds
     * or as a duration string like `1:23:45` = 1 hour 23 minutes and 45 seconds,
     * mutually exclusive to `endTime`, for example `12`.
     */
    duration?: number;
    /**
     * This property is moved into the sample “complete”. The end time in seconds
     * or as a duration string like `1:23:45` = 1 hour 23 minutes and 45 seconds,
     * mutually exclusive to `duration` `163.12376`.
     */
    endTime?: number;
    /**
     * This property is moved into the sample “complete”. The fade in time in
     * seconds or as a duration string like `1:23:45` = 1 hour 23 minutes and 45
     * seconds for example `5`.
     */
    fadeIn?: number;
    /**
     * This property is moved into the sample “complete”. The fade out time in
     * seconds or as a duration string like `1:23:45` = 1 hour 23 minutes and 45
     * seconds for example `5`.
     */
    fadeOut?: number;
    /**
     * This property is moved into the sample “complete”. The keyboard shortcut to
     * play the media. A custom shortcut for mousetrap, for example `o 1`.
     */
    shortcut?: string;
    /**
     * An array of Sample instances.
     */
    samples?: SampleYamlFormat[];
    /**
     * An media URI of a image to use a preview image for mainly audio files.
     * Video files are also supported.
     */
    cover?: string;
    composer?: string;
    artist?: string;
    [property: string]: any;
}
/**
 * Exported from the media server REST API
 */
export interface RestApiRaw extends YamlFormat {
    mimeType: string;
    extension: string;
    /**
     * The file name, for example `Haydn_Joseph.jpg`.
     */
    filename: string;
    /**
     * The relative path on the HTTP server, for example
     * `composer/Haydn_Joseph.jpg`.
     */
    path: string;
    /**
     * Indicates whether the media asset has a preview image (`_preview.jpg`).
     */
    previewImage: boolean;
    /**
     * Indicates wheter the media asset has a waveform image (`_waveform.png`).
     */
    hasWaveform: boolean;
    /**
     * The number of parts of a multipart media asset.
     */
    multiPartCount?: number;
    [property: string]: any;
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
     */
    asset: Asset;
    /**
     * Raw data coming from the YAML format.
     */
    yaml: SampleYamlFormat;
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
     * The start time in seconds. The sample is played from this start time
     * using the `mediaElement` of the `asset`. It is the “zero” second
     * for the sample.
     */
    startTimeSec: number;
    /**
     * The duration of the sample in seconds.
     */
    durationSec?: number;
    /**
     * Time in seconds to fade in.
     */
    fadeInSec: number;
    /**
     * Time in seconds to fade out.
     */
    fadeOutSec: number;
}
export interface SampleCollection extends Cache<Sample> {
}
/**
 * Hold various data of a media file as class properties.
 *
 * If a media file has a property with the name `multiPartCount`, it is a
 * multipart asset. A multipart asset can be restricted to one part only by a
 * URI fragment (for example `#2`). The URI `ref:Score#2` resolves always to the
 * HTTP URL `http:/example/media/Score_no02.png`.
 */
export interface Asset {
    /**
     * A raw javascript object read from the YAML files
     * (`*.extension.yml`)
     */
    yaml: RestApiRaw;
    uri: MediaUri;
    /**
     * The HTMLMediaElement of the media file.
     */
    htmlElement?: object;
    /**
     * The media type, for example `image`, `audio` or `video`.
     */
    mimeType: string;
    /**
     * HTTP Uniform Resource Locator, for example
     * `http://localhost/media/Lieder/i/Ich-hab-zu-Haus-ein-Gramophon/HB/Ich-hab-zu-Haus-ein-Grammophon.m4a`.
     */
    httpUrl: string;
    samples?: SampleCollection;
    /**
     * The reference authority of the URI using the `ref` scheme. The returned
     * string is prefixed with `ref:`.
     */
    ref: string;
    /**
     * The UUID authority of the URI using the `uuid` scheme. The returned
     * string is prefixed with `uuid:`.
     */
    uuid: string;
    shortcut?: string;
    /**
     * Each media asset can have a preview image. The suffix `_preview.jpg`
     * is appended on the path. For example
     * `http://localhost/media/Lieder/i/Ich-hab-zu-Haus-ein-Gramophon/HB/Ich-hab-zu-Haus-ein-Grammophon.m4a_preview.jpg`
     */
    previewHttpUrl?: string;
    /**
     * Each meda asset can be associated with a waveform image. The suffix `_waveform.png`
     * is appended on the HTTP URL. For example
     * `http://localhost/media/Lieder/i/Ich-hab-zu-Haus-ein-Gramophon/HB/Ich-hab-zu-Haus-ein-Grammophon.m4a_waveform.png`
     */
    waveformHttpUrl?: string;
    titleSafe: string;
    /**
     * True if the media file is playable, for example an audio or a video file.
     */
    isPlayable: boolean;
    /**
     * True if the media file is visible, for example an image or a video file.
     */
    isVisible: boolean;
    /**
     * The number of parts of a multipart media asset.
     */
    multiPartCount: number;
    /**
     * Retrieve the HTTP URL of the multi part asset by the part number.
     *
     * @param The part number starts with 1.
     */
    getMultiPartHttpUrlByNo: (no: number) => string;
}
