/**
 * Core functionality for the BALDR songbook without node dependencies.
 * @module @bldr/songbook-core
 */
import { sortObjectsByProperty } from '@bldr/core-browser';
import { formatWikidataUrl, formatWikipediaUrl, formatYoutubeUrl } from '@bldr/string-format';
export const songConstants = {
    intermediateFolder: 'NB',
    firstSlideName: 'Projektor.svg',
    firstPianoName: 'Piano.eps',
    slideRegExp: /\.svg$/i,
    pianoRegExp: /\.eps$/i
};
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
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class AlphabeticalSongsTree {
    /**
     * @param songs - An array of song objects.
     */
    constructor(songs) {
        for (const song of songs) {
            if (!{}.hasOwnProperty.call(this, song.abc))
                this[song.abc] = [];
            this[song.abc].push(song);
        }
        for (const abc in this) {
            this[abc].sort(sortObjectsByProperty('songId'));
        }
    }
}
/**
 * Combine and transform some song metadata properties.
 *
 * Mapping
 *
 * - title: title (year)
 * - subtitle: subtitle - alias - country
 * - composer: composer, artist, genre
 * - lyricist: lyricist
 */
export class SongMetaDataCombined {
    /**
     * @param songMetaData - A song
     * metadata object.
     */
    constructor(songMetaData) {
        /**
         * The raw metadata object originating from the info.yml file.
         */
        this.metaData = songMetaData;
        /**
         * All property names of all getters as an array.
         */
        this.allProperties = [
            'composer',
            'lyricist',
            'musescoreUrl',
            'subtitle',
            'title',
            'wikidataUrl',
            'wikipediaUrl',
            'youtubeUrl'
        ];
    }
    /**
     * An array of external sites a song is linked to. Each external site has
     * its ...URL property.
     */
    static externalSites() {
        return ['musescore', 'wikidata', 'wikipedia', 'youtube'];
    }
    /**
     * Extract the values of given properties of an object and collect it into
     * an array.
     *
     * @params properties - Some object properties to collect strings from.
     * @params object - An object.
     */
    static collectProperties(properties, object) {
        const parts = [];
        for (const property of properties) {
            if (property in object && object[property] != null) {
                parts.push(object[property]);
            }
        }
        return parts;
    }
    /**
     * Format: `composer, artist, genre`
     */
    get composer() {
        let properties;
        if (this.metaData.composer === this.metaData.artist) {
            properties = ['composer', 'genre'];
        }
        else {
            properties = ['composer', 'artist', 'genre'];
        }
        const collection = SongMetaDataCombined.collectProperties(properties, this.metaData);
        if (collection.length > 0) {
            return collection.join(', ');
        }
    }
    /**
     * Return the lyricist only if it is not the same as in the fields
     * `artist` and `composer`.
     *
     * Format: `lyricist`
     */
    get lyricist() {
        if (this.metaData.lyricist != null &&
            this.metaData.lyricist !== this.metaData.artist &&
            this.metaData.lyricist !== this.metaData.composer) {
            return this.metaData.lyricist;
        }
    }
    /**
     * For example: `https://musescore.com/score/1234`
     */
    get musescoreUrl() {
        if (this.metaData.musescore != null) {
            return `https://musescore.com/score/${this.metaData.musescore}`;
        }
    }
    /**
     * Format: `subtitle - alias - country`
     */
    get subtitle() {
        const collection = SongMetaDataCombined.collectProperties(['subtitle', 'alias', 'country'], this.metaData);
        if (collection.length > 0) {
            return collection.join(' - ');
        }
    }
    /**
     * title (year)
     */
    get title() {
        if (this.metaData.year != null) {
            return `${this.metaData.title} (${this.metaData.year})`;
        }
        return this.metaData.title;
    }
    /**
     * For example: `https://www.wikidata.org/wiki/Q42`
     */
    get wikidataUrl() {
        if (this.metaData.wikidata != null) {
            return formatWikidataUrl(this.metaData.wikidata);
        }
    }
    /**
     * For example: `https://en.wikipedia.org/wiki/A_Article`
     */
    get wikipediaUrl() {
        if (this.metaData.wikipedia != null) {
            return formatWikipediaUrl(this.metaData.wikipedia);
        }
    }
    /**
     * For example: `https://youtu.be/CQYypFMTQcE`
     */
    get youtubeUrl() {
        if (this.metaData.youtube != null) {
            return formatYoutubeUrl(this.metaData.youtube);
        }
    }
    toJSON() {
        const output = {
            title: this.title
        };
        if (this.subtitle != null)
            output.subtitle = this.subtitle;
        if (this.composer != null)
            output.composer = this.composer;
        if (this.lyricist != null)
            output.lyricist = this.lyricist;
        return output;
    }
}
/**
 * The song library - a collection of songs
 */
export class CoreLibrary {
    constructor(songs) {
        this.songs = songs;
        this.songIds = Object.keys(this.songs).sort(undefined);
        this.currentSongIndex = 0;
    }
    toArray() {
        return Object.values(this.songs);
    }
    toDynamicSelect() {
        const result = [];
        for (const songId of this.songIds) {
            const song = this.getSongById(songId);
            result.push({ ref: song.songId, name: song.metaData.title });
        }
        return result;
    }
    /**
     * Count the number of songs in the song library
     */
    countSongs() {
        return this.songIds.length;
    }
    /**
     * Update the index of the song IDs array. If a song is opened via the search
     * form, it is possible to go to the next or previous song of the opened song.
     *
     * @returns The index in the songIds array.
     */
    updateCurrentSongIndex(songId) {
        this.currentSongIndex = this.songIds.indexOf(songId);
        return this.currentSongIndex;
    }
    /**
     * Get the song object from the song ID.
     *
     * @param songId - The ID of the song. (The parent song folder)
     */
    getSongById(songId) {
        if (songId in this.songs) {
            return this.songs[songId];
        }
        else {
            throw new Error(`There is no song with the songId: ${songId}`);
        }
    }
    /**
     * Get the previous song
     */
    getPreviousSong() {
        if (this.currentSongIndex === 0) {
            this.currentSongIndex = this.countSongs() - 1;
        }
        else {
            this.currentSongIndex -= 1;
        }
        return this.getSongById(this.songIds[this.currentSongIndex]);
    }
    /**
     * Get the next song
     */
    getNextSong() {
        if (this.currentSongIndex === this.countSongs() - 1) {
            this.currentSongIndex = 0;
        }
        else {
            this.currentSongIndex += 1;
        }
        return this.getSongById(this.songIds[this.currentSongIndex]);
    }
    /**
     * Get a random song.
     */
    getRandomSong() {
        const randomIndex = Math.floor(Math.random() * this.songIds.length);
        if (this.currentSongIndex !== randomIndex) {
            return this.getSongById(this.songIds[randomIndex]);
        }
        else {
            return this.getNextSong();
        }
    }
    toJSON() {
        return this.songs;
    }
}
