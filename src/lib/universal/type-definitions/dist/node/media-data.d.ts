export interface MediaData {
    path: string;
    [property: string]: any;
}
export interface MinimalAssetMetaData extends Omit<MediaData, 'path'> {
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
