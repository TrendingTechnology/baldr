import { formatMusescoreUrl, formatWikidataUrl, formatWikipediaUrl, formatYoutubeUrl } from '@bldr/string-format';
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
    metaData;
    allProperties;
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
            return formatMusescoreUrl(this.metaData.musescore);
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
        if (this.subtitle != null) {
            output.subtitle = this.subtitle;
        }
        if (this.composer != null) {
            output.composer = this.composer;
        }
        if (this.lyricist != null) {
            output.lyricist = this.lyricist;
        }
        return output;
    }
}
