/**
 * This package bundles all objects functions together, which are used to
 * generate the intermediate files for the songbook. It has to be it’s own
 * package, because the dependency better-sqlite3 must be complied and that
 * causes trouble in the electron app.
 *
 * @module @bldr/songbook-intermediate-files
 */
/// <reference types="node" />
import * as childProcess from 'child_process';
import { SongMetaDataCombined, CoreLibrary, SongCollection, Song, SongMetaData } from '@bldr/songbook-core';
declare type IntermediateSongList = IntermediateSong[];
interface IntermediaSongCollection {
    [songId: string]: IntermediateSong;
}
/**
 * Generate all intermediate media files or only slide
 * or piano files. Possible values: “all”, “slides” or “piano”.
 */
declare type GenerationMode = 'all' | 'slides' | 'piano';
/*******************************************************************************
 * Utility classes
 ******************************************************************************/
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
/*******************************************************************************
 * Song classes
 ******************************************************************************/
interface RawYamlData {
    alias: string;
    arranger: string;
    artist: string;
    audio: string;
    composer: string;
    country: string;
    description: string;
    genre: string;
    lyricist: string;
    musescore: string;
    source: string;
    subtitle: string;
    title: string;
    wikidata: string;
    wikipedia: string;
    year: string;
    youtube: string;
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
    alias: string;
    arranger: string;
    artist: string;
    audio: string;
    composer: string;
    country: string;
    description: string;
    genre: string;
    lyricist: string;
    musescore: string;
    source: string;
    subtitle: string;
    title: string;
    wikidata: string;
    wikipedia: string;
    year: string;
    youtube: string;
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
    rawYaml_: RawYamlData;
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
declare class ExtendedSong implements Song {
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
/*******************************************************************************
 * Classes for multiple songs
 ******************************************************************************/
/**
 * The song library - a collection of songs
 */
declare class Library extends CoreLibrary {
    /**
     * The base path of the song library
     */
    basePath: string;
    /**
     * @param basePath - The base path of the song library
     */
    constructor(basePath: string);
    /**
     * Identify a song folder by searching for a file named “info.yml.”
     */
    protected detectSongs(): string[];
    /**
     * @param listFile
     *
     * @returns {object}
     */
    loadSongList(listFile: string): SongCollection;
}
/**
 * A text file.
 */
declare class TextFile {
    /**
     * The path of the text file.
     */
    path: string;
    /**
     * @param path The path of the text file.
     */
    constructor(path: string);
    /**
     * Append content to the text file.
     *
     * @param content - Content to append to the text file.
     */
    append(content: string): void;
    /**
     * Read the whole text file.
     */
    read(): string;
    /**
     * Delete the content of the text file, not the text file itself.
     */
    flush(): void;
    /**
     * Remove the text file.
     */
    remove(): void;
}
/**
 * The piano score.
 *
 * Generate the TeX file for the piano version of the songbook. The page
 * orientation of the score is in the landscape format. Two
 * EPS files exported from MuseScore fit on one page. To avoid page breaks
 * within a song a piano accompaniment must not have more than four
 * EPS files.
 */
export declare class PianoScore {
    /**
     * A temporary file path where the content of the TeX file gets stored.
     */
    texFile: TextFile;
    library: IntermediateLibrary;
    groupAlphabetically: boolean;
    pageTurnOptimized: boolean;
    constructor(library: IntermediateLibrary, groupAlphabetically?: boolean, pageTurnOptimized?: boolean);
    /**
     * Generate TeX markup. Generate a TeX command prefixed with \tmp.
     *
     * @param command
     * @param value
     *
     * @return A TeX markup, for example: \tmpcommand{value}\n
     */
    static texCmd(command: string, value?: string): string;
    static sanitize(markup: string): string;
    /**
     * Fill a certain number of pages with piano score files.
     *
     * @param countTree - Piano scores grouped by page number.
     * @param songs - An array of song objects.
     * @param pageCount - Number of pages to group together.
     *
     * @returns An array of song objects, which fit in a given page number
     */
    static selectSongs(countTree: PianoFilesCountTree, songs: IntermediateSongList, pageCount: number): IntermediateSongList;
    /**
     * Build the TeX markup of an array of song objects
     *
     * @param songs - An array of song objects.
     *
     * @return {string}
     */
    static buildSongList(songs: IntermediateSongList, pageTurnOptimized?: boolean): string;
    /**
     * Build the TeX markup for all songs.
     *
     * @param {boolean} groupAlphabetically
     * @param {boolean} pageTurnOptimized
     *
     * @returns {string}
     */
    build(): string;
    /**
     * Read the content of a text file.
     *
     * @param The name of the text (TeX) file inside this package
     */
    private read;
    private spawnTex;
    /**
     * Compile the TeX file using lualatex and open the compiled pdf.
     */
    compile(): void;
}
/**
 * Extended version of the Song class to build intermediate files.
 */
declare class IntermediateSong extends ExtendedSong {
    /**
     * @param songPath - The path of the directory containing the song
     * files or a path of a file inside the song folder (not nested in subfolders)
     */
    constructor(songPath: string);
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
     * @param filter - A string to filter the list of file names.
     * @param newMultipartFilename - The new base name of the multipart files.
     *
     * @returns An array of the renamed multipart files names.
     */
    private renameMultipartFiles;
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
/**
 * An object that groups songs that have the same number of piano files.
 *
 * This tree object is an helper object. It is necessary to avoid page breaks
 * on multipage piano scores.
 *
 * <pre><code>
 * {
 *   "1": [ 1-page-song, 1-page-song ... ],
 *   "2": [ 2-page-song ... ],
 *   "3": [ 3-page-song ... ]
 *   "3": [ 3-page-song ... ]
 * }
 * </code></pre>
 */
declare class PianoFilesCountTree {
    private readonly validCounts;
    private cache;
    /**
     * @param songs - An array of song objects.
     */
    constructor(songs: IntermediateSongList);
    /**
     * @param count - 1, 2, 3, 4
     */
    private checkCount;
    /**
     * @param songs - An array of song objects.
     */
    private build;
    /**
     * Sum up the number of all songs in all count categories.
     */
    sum(): number;
    /**
     * Sum up the number of files of all songs in all count categories.
     */
    sumFiles(): number;
    /**
     * Return true if the count tree has no songs.
     *
     * @return {boolean}
     */
    isEmpty(): boolean;
    /**
     * Shift the array of songs that has ”count” number of piano files.
     *
     * @param count - 1, 2, 3, 4
     *
     * @returns Song
     */
    shift(count: number): IntermediateSong | undefined;
}
export declare class IntermediateLibrary extends Library {
    songs: IntermediaSongCollection;
    /**
     * @param basePath - The base path of the song library
     */
    constructor(basePath: string);
    /**
     * Execute git pull if repository exists.
     */
    gitPull(): childProcess.SpawnSyncReturns<Buffer> | undefined;
    private collectSongs;
    /**
     * Delete multiple files.
     *
     * @param files - An array of files to delete.
     */
    private deleteFiles;
    /**
     * Clean all intermediate media files.
     */
    cleanIntermediateFiles(): void;
    /**
     * Calls the method generateIntermediateFiles on each song
     *
     * @param mode - Generate all intermediate media files or only slide
     *   and piano files. Possible values: “all”, “slides” or “piano”
     * @param force - Force the regeneration of intermediate files.
     */
    generateIntermediateFiles(mode?: GenerationMode, force?: boolean): void;
    /**
     * Generate all intermediate media files for one song.
     *
     * @param folder - The path of the parent song folder.
     * @param mode - Generate all intermediate media files or only slide
     *   and piano files. Possible values: “all”, “slides” or “piano”
     */
    updateSongByPath(folder: string, mode?: GenerationMode): void;
    /**
     * Generate all intermediate media files for one song.
     *
     * @param songId - The ID of the song (the name of the parent song folder)
     * @param {string} mode - Generate all intermediate media files or only slide
     *   and piano files. Possible values: “all”, “slides” or “piano”
     */
    updateSongBySongId(songId: string, mode?: GenerationMode): void;
    /**
     * Update the whole song library.
     *
     * @param mode - Generate all intermediate media files or only slide
     *   and piano files. Possible values: “all”, “slides” or “piano”
     * @param force - Force the regeneration of intermediate files.
     */
    update(mode?: GenerationMode, force?: boolean): void;
}
/**
 * Export the intermediate SVG files to the media server. Adjust the
 * `info.yml` and copy it to the destination folder of the media server.
 */
export declare function exportToMediaServer(library: IntermediateLibrary): void;
/**
 * Build the Vue app. All image files must be copied into the Vue working
 * directory.
 */
export declare function buildVueApp(): void;
export {};
