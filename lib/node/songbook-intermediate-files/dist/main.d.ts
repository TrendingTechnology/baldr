/**
 * This package bundles all objects functions together, which are used to
 * generate the intermediate files for the songbook. It has to be it’s own
 * package, because the dependency better-sqlite3 must be complied and that
 * causes trouble in the electron app.
 *
 * @module @bldr/songbook-intermediate-files
 */
import { CoreLibrary, SongCollection, Song } from '@bldr/songbook-core';
import { IntermediateSong } from './song';
/**
 * Generate all intermediate media files or only slide
 * or piano files. Possible values: “all”, “slides” or “piano”.
 */
export declare type GenerationMode = 'all' | 'slides' | 'piano';
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
    loadSongList(listFile: string): SongCollection<Song>;
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
    /**
     * Escape `\&`.
     *
     * @param markup A input string
     *
     * @returns A TeX safe string with escaped `\&`.
     */
    static sanitize(markup: string | undefined): string;
    /**
     * Fill a certain number of pages with piano score files.
     *
     * @param countTree - Piano scores grouped by page number.
     * @param songs - An array of song objects.
     * @param pageCount - Number of pages to group together.
     *
     * @returns An array of song objects, which fit in a given page number
     */
    static selectSongs(countTree: PianoFilesCountTree, songs: IntermediateSong[], pageCount: number): IntermediateSong[];
    /**
     * Build the TeX markup of an array of song objects
     *
     * @param songs - An array of song objects.
     *
     * @return {string}
     */
    static buildSongList(songs: IntermediateSong[], pageTurnOptimized?: boolean): string;
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
    constructor(songs: IntermediateSong[]);
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
    songs: SongCollection<IntermediateSong>;
    /**
     * @param basePath - The base path of the song library
     */
    constructor(basePath: string);
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
    private generateIntermediateFiles;
    private generateMetaDataForMediaServer;
    generateLibraryJson(): void;
    compilePianoScore(groupAlphabetically: boolean, pageTurnOptimized: boolean): void;
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
     * @param mode - Generate all intermediate media files or only slide
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
export {};
