import { Song, DynamicSelectSong } from './song';
/**
 * A tree of songs where the song arrays are placed in alphabetical properties.
 * An instanace of this class would look like this example:
 *
 * <pre><code>
 * {
 *   "a": [ song, song ],
 *   "s": [ song, song ],
 *   "z": [ song, song ]
 * }
 * </code></pre>
 */
export declare class AlphabeticalSongsTree {
    [songId: string]: Song[];
    /**
     * @param songs - An array of song objects.
     */
    constructor(songs: Song[]);
}
export interface SongCollection<T> {
    [songId: string]: T;
}
/**
 * The song library - a collection of songs
 */
export declare class CoreLibrary {
    /**
     * The collection of songs
     */
    songs: SongCollection<Song>;
    /**
     * An array of song IDs.
     */
    songIds: string[];
    /**
     * The current index of the array this.songIds. Used for the methods
     * getNextSong and getPreviousSong
     */
    currentSongIndex: number;
    constructor(songs: SongCollection<Song>);
    toArray(): Song[];
    toDynamicSelect(): DynamicSelectSong[];
    /**
     * Count the number of songs in the song library
     */
    countSongs(): number;
    /**
     * Update the index of the song IDs array. If a song is opened via the search
     * form, it is possible to go to the next or previous song of the opened song.
     *
     * @returns The index in the songIds array.
     */
    updateCurrentSongIndex(songId: string): number;
    /**
     * Get the song object from the song ID.
     *
     * @param songId - The ID of the song. (The parent song folder)
     */
    getSongById(songId: string): Song;
    /**
     * Get the previous song
     */
    getPreviousSong(): Song;
    /**
     * Get the next song
     */
    getNextSong(): Song;
    /**
     * Get a random song.
     */
    getRandomSong(): Song;
    toJSON(): Record<string, any>;
}
