/**
 * Classes which represent a song.
 *
 * @module @bldr/songbook-intermediate-files/song
 */
import { SongMetaDataCombined, Song, SongMetaData } from '@bldr/songbook-core';
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
    readonly rawYaml: RawYamlData;
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
export {};
