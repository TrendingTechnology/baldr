/**
 * Classes which represent a song.
 *
 * @module @bldr/songbook-intermediate-files/song
 */
import { SongMetaDataCombined, Song, SongMetaData } from '@bldr/songbook-core';
import { GenerationMode } from './main';
/**
 * A wrapper class for a folder. If the folder does not exist, it will be
 * created during instantiation.
 */
declare class Folder {
    /**
     * The path of the folder.
     */
    folderPath: string;
    /**
     * @param folderPath - The path segments of the folder.
     */
    constructor(...folderPath: string[]);
    /**
     * Return the path of the folder.
     */
    get(): string;
    /**
     * Empty the folder (Delete all it’s files).
     */
    empty(): void;
    /**
     * Remove the folder.
     */
    remove(): void;
}
/**
 * Metadata of a song catched from the info.yml file.
 *
 * info.yml
 *
 *     ---
 *     alias: I’m sitting here
 *     arranger: Josef Friedrich
 *     artist: Fools Garden
 *     composer: Heinz Müller / Manfred Meier
 *     country: Deutschland
 *     genre: Spiritual
 *     lyricist: Goethe
 *     musescore: https://musescore.com/user/12559861/scores/4801717
 *     source: http://wikifonia.org/node/9928/revisions/13488/view
 *     subtitle: A very good song
 *     title: Lemon tree
 *     year: 1965
 */
declare class ExtendedSongMetaData implements SongMetaData {
    alias?: string;
    arranger?: string;
    artist?: string;
    audio?: string;
    composer?: string;
    country?: string;
    description?: string;
    genre?: string;
    lyricist?: string;
    musescore?: string;
    source?: string;
    subtitle?: string;
    title: string;
    wikidata?: string;
    wikipedia?: string;
    year?: string;
    youtube?: string;
    /**
     * The file name of the YAML file.
     */
    yamlFile: string;
    /**
     * All in the YAML file “info.yml” allowed properties (keys).
     */
    allowedProperties: string[];
    /**
     * The path of then parent song folder.
     */
    folder: string;
    /**
     * A Javascript object representation of the `info.yml` file.
     */
    readonly rawYaml: SongMetaData;
    /**
     * @param folder - Path of the song folder.
     */
    constructor(folder: string);
    toJSON(): {
        [index: string]: string;
    };
}
/**
 * One song
 */
export declare class ExtendedSong implements Song {
    folder: string;
    abc: string;
    songId: string;
    metaData: ExtendedSongMetaData;
    metaDataCombined: SongMetaDataCombined;
    folderIntermediateFiles: Folder;
    /**
     * Path of the MuseScore file 'projector.mscx', relative to the base folder
     * of the song collection.
     */
    mscxProjector: string;
    /**
     * Path of the MuseScore file for the piano parts, can be 'piano.mscx'
     * or 'lead.mscx', relative to the base folder
     * of the song collection.
     */
    mscxPiano: string;
    /**
     * An array of piano score pages in the EPS format.
     */
    pianoFiles: string[];
    /**
     * An array of slides file in the SVG format. For example:
     * `[ '01.svg', '02.svg' ]`
     */
    slidesFiles: string[];
    /**
     * @param songPath - The path of the directory containing the song
     * files or a path of a file inside the song folder (not nested in subfolders)
     */
    constructor(songPath: string);
    /**
     * Get the song folder.
     *
     * @param songPath - The path of the directory containing the song
     *   files or a path of a file inside the song folder (not nested in
     *   subfolders) or a non-existing song path.
     *
     * @return The path of the parent directory of the song.
     */
    private getSongFolder;
    /**
     * @param folder - The directory containing the song files.
     *
     * @return A single character
     */
    private recognizeABCFolder;
    /**
     * Detect a file inside the song folder. Throw an exception if the
     * file doesn’t exist.
     *
     * @param file - A filename of a file inside the song folder.
     *
     * @return A joined path of the file relative to the song collection
     *   base dir.
     */
    private detectFile;
    toJSON(): object;
}
/**
 * Extended version of the Song class to build intermediate files.
 */
export declare class IntermediateSong extends ExtendedSong {
    /**
     * Format one image file of a piano score in the TeX format.
     *
     * @param index - The index number of the array position
     *
     * @return TeX markup for one EPS image file of a piano score.
     */
    private formatPianoTeXEpsFile;
    /**
     * Generate TeX markup for one song.
     *
     * @return {string} TeX markup for a single song.
     * <code><pre>
     * \tmpmetadata
     * {title} % title
     * {subtitle} % subtitle
     * {composer} % composer
     * {lyricist} % lyricist
     * \tmpimage{s/Swing-low/piano/piano_1.eps}
     * \tmpimage{s/Swing-low/piano/piano_2.eps}
     * \tmpimage{s/Swing-low/piano/piano_3.eps}
     * </pre><code>
     */
    formatPianoTex(): string;
    /**
     * Generate form a given *.mscx file a PDF file.
     *
     * @param source - Name of the *.mscx file without the extension.
     * @param destination - Name of the PDF without the extension.
     */
    private generatePDF;
    /**
     * Rename an array of multipart media files to follow the naming scheme `_noXXX.extension`.
     *
     * @param folder - The folder containing the files to be renamed.
     * @param regExp - A string to filter the list of file names.
     * @param newMultipartFilename - The new base name of the multipart files.
     *
     * @returns An array of the renamed multipart files names.
     */
    private renameMultipartFiles;
    generateMetaDataForMediaServer(): void;
    /**
     * Generate SVG files in the slides subfolder.
     */
    private generateSlides;
    /**
     * Generate EPS files for the piano score from the MuseScore file
     * “piano/piano.mscx” .
     *
     * @return An array of EPS piano score filenames.
     */
    private generatePiano;
    /**
     * Wrapper method for all process methods of one song folder.
     *
     * @param mode - Generate all intermediate media files or only slide
     *   and piano files. Possible values: “all”, “slides” or “piano”
     * @param force - Force the regeneration of intermediate files.
     */
    generateIntermediateFiles(mode?: GenerationMode, force?: boolean): void;
    /**
     * Delete all generated intermediate files of a song folder.
     */
    cleanIntermediateFiles(): void;
}
export {};
