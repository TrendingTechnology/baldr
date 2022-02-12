export interface MediaData {
    path: string;
    [property: string]: any;
}
export interface MinimalAssetMetaData extends Omit<MediaData, 'path'> {
}
/**
 * Following properties are moved into the sample “complete”: `startTime`,
 * `duration`, `endTime`, `fadeIn`, `fadeOut`, `shortcut`
 */
export interface SampleMetaData {
    /**
     * for example `Theme 1`
     */
    title?: string;
    /**
     * without spaces, only ASCII, for example `theme_1`
     */
    ref: string;
    /**
     * The start time in seconds or as a duration string like `1:23:45` = 1 hour
     * 23 minutes and 45 seconds, for example `61.123435`.
     */
    startTime: number | string;
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
 * As stored in the database
 */
export interface AssetMetaData extends MediaData {
    /**
     * A reference string, for example `Haydn_Joseph`.
     */
    ref: string;
    uuid: string;
    title: string;
    /**
     * Indicates whether the media asset has a preview image (`_preview.jpg`).
     */
    hasPreview?: boolean;
    /**
     * Indicates wheter the media asset has a waveform image (`_waveform.png`).
     */
    hasWaveform?: boolean;
    /**
     * The number of parts of a multipart media asset.
     */
    multiPartCount?: number;
    mimeType?: string;
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
    samples?: SampleMetaData[];
    /**
     * An media URI of a image to use a preview image for mainly audio files.
     * Video files are also supported.
     */
    cover?: string;
    composer?: string;
    artist?: string;
}
/**
 * The meta informations of a presentation file.
 *
 * ```yaml
 * meta:
 *   ref: An unique reference string
 *   uuid: 75bd3ec8-a322-477c-ad7a-5915513f9dd8
 *   path: path/to/Praesenation.baldr.yml
 *   title: A title
 *   subtitle: A subtitle
 *   subject: Musik
 *   grade: The grade the presentation belongs to.
 *   curriculum: Relation to the curriculum.
 *   curriculum_url: http://curriculum.com
 * ```
 */
interface PresentationMetaData {
    /**
     * A reference string to identify the presentation (for example:
     * `Wiener-Klassik`)
     */
    ref: string;
    /**
     * A Universally Unique Identifier to identify the presentation.
     */
    uuid?: string;
    path?: string;
    /**
     * The title of the presentation. (for example: `Das orchestrale Klangbild bei
     * Beethoven`)
     */
    title: string;
    /**
     * The subtitle of the presentation in the form: `<em
     * class="person">Composer</em>: <em class="piece">Piece</em> (year)`. (for
     * example: `<em class="person">Ludwig van Beethoven</em>: <em
     * class="piece">Sinfonie Nr. 8 F-Dur op. 93</em> (1812)`)
     */
    subtitle?: string;
    /**
     * The school subject, for example `Musik` or `Informatik`.
     */
    subject?: string;
    /**
     * The grade the presentation belongs to. (for example: `11`)
     */
    grade?: number;
    /**
     * Relation to the curriculum. (for example: `Klangkörper im Wandel / Das
     * Klangbild der Klassik`)
     */
    curriculum?: string;
    /**
     * URL of the curriculum web page. (for example:
     * `https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/5/musik`)
     */
    curriculumUrl?: string;
}
export interface PresentationData {
    meta: PresentationMetaData;
    slides: any[];
}
export {};
