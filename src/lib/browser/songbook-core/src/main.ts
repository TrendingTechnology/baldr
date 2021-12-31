/**
 * Core functionality for the BALDR songbook without node dependencies.
 * @module @bldr/songbook-core
 */

import { sortObjectsByProperty } from '@bldr/core-browser'

import {
  formatWikidataUrl,
  formatWikipediaUrl,
  formatYoutubeUrl
} from '@bldr/string-format'

import { StringIndexedObject } from '@bldr/type-definitions'

export const songConstants = {
  intermediateFolder: 'NB',
  firstSlideName: 'Projektor.svg',
  firstPianoName: 'Piano.eps',
  slideRegExp: /\.svg$/i,
  pianoRegExp: /\.eps$/i
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
export interface SongMetaData {
  /**
   * Alias for a song title, e. g. “Sehnsucht nach dem Frühlinge” “Komm,
   * lieber Mai, und mache”
   */
  alias?: string

  /**
   * The arranger of a song.
   */
  arranger?: string

  /**
   * The artist of a song.
   */
  artist?: string

  /**
   * A media server URI of a audio file for example (id:A_Song).
   */
  audio?: string

  /**
   * The composer of a song.
   */
  composer?: string

  /**
   * The country the song is from.
   */
  country?: string

  /**
   * A longer text which describes the song.
   */
  description?: string

  /**
   * The genre of the song.
   */
  genre?: string

  /**
   * The lyricist of the song.
   */
  lyricist?: string

  /**
   * The MuseScore score ID from musescore.com, for example the score ID
   * from https://musescore.com/user/1601631/scores/1299601 is 1299601.
   */
  musescore?: string

  /**
   * A text or a URL which describes the source of a song.
   */
  source?: string

  /**
   * The subtitle of a song.
   */
  subtitle?: string

  /**
   * The title of a song.
   */
  title: string

  /**
   * The Wikidata data item ID (without the Q prefix)
   */
  wikidata?: string

  /**
   * ID of a wikipedia article (e. g. en:A_Article)
   */
  wikipedia?: string

  /**
   * The year the song was released.
   */
  year?: string

  /**
   * The youtube ID (e. g. CQYypFMTQcE)
   */
  youtube?: string
}

/**
 * One song
 *
 * A JSON version of the Song class (obtained from `Song.toJSON()`
 * and `JSON.stringify()`) or a instance of the class `Song()`
 *
 * ```json
 * {
 *   "abc": "y",
 *   "folder": "/home/jf/git-repositories/content/lieder/y/Yesterday",
 *   "metaData": {
 *     "artist": "The Beatles",
 *     "composer": "Paul McCartney",
 *     "title": "Yesterday",
 *     "wikidata": 202698,
 *     "wikipedia": "de:Yesterday",
 *     "year": 1965,
 *     "youtube": "wXTJBr9tt8Q"
 *   },
 *   "songId": "Yesterday",
 *   "slidesCount": 2
 * }
 * ```
 *
 * @see {@link module:@bldr/songbook-intermediate-files~Song}
 *
 *
 */
export interface Song {
  /**
   * The directory containing the song files. For example
   * `/home/jf/songs/w/Wir-sind-des-Geyers-schwarze-Haufen`.
   */
  folder: string

  /**
   * The character of the alphabetical folder. The song folders must
   * be placed in alphabetical folders.
   */
  abc: string

  /**
   * The songId is the name of the directory which contains all song
   * files. It is used to sort the songs. It must be unique along all
   * songs. For example: `Wir-sind-des-Geyers-schwarze-Haufen`.
   */
  songId: string

  metaData: SongMetaData

  metaDataCombined: SongMetaDataCombined
}

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
  [songId: string]: Song[]

  /**
   * @param songs - An array of song objects.
   */
  constructor (songs: Song[]) {
    for (const song of songs) {
      if (!{}.hasOwnProperty.call(this, song.abc)) this[song.abc] = []
      this[song.abc].push(song)
    }
    for (const abc in this) {
      this[abc].sort(sortObjectsByProperty('songId'))
    }
  }
}

/**
 * A reduced song to fit to the dynamic select interface.
 */
export interface DynamicSelectSong {
  ref: string
  name: string
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
  private readonly metaData: SongMetaData
  public allProperties: string[]
  /**
   * @param songMetaData - A song
   * metadata object.
   */
  constructor (songMetaData: SongMetaData) {
    /**
     * The raw metadata object originating from the info.yml file.
     */
    this.metaData = songMetaData

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
    ]
  }

  /**
   * An array of external sites a song is linked to. Each external site has
   * its ...URL property.
   */
  static externalSites (): string[] {
    return ['musescore', 'wikidata', 'wikipedia', 'youtube']
  }

  /**
   * Extract the values of given properties of an object and collect it into
   * an array.
   *
   * @params properties - Some object properties to collect strings from.
   * @params object - An object.
   */
  private static collectProperties (
    properties: string[],
    object: StringIndexedObject
  ): string[] {
    const parts = []
    for (const property of properties) {
      if (property in object && object[property] != null) {
        parts.push(object[property])
      }
    }
    return parts
  }

  /**
   * Format: `composer, artist, genre`
   */
  get composer (): string | undefined {
    let properties
    if (this.metaData.composer === this.metaData.artist) {
      properties = ['composer', 'genre']
    } else {
      properties = ['composer', 'artist', 'genre']
    }
    const collection = SongMetaDataCombined.collectProperties(
      properties,
      this.metaData
    )
    if (collection.length > 0) {
      return collection.join(', ')
    }
  }

  /**
   * Return the lyricist only if it is not the same as in the fields
   * `artist` and `composer`.
   *
   * Format: `lyricist`
   */
  get lyricist (): string | undefined {
    if (
      this.metaData.lyricist != null &&
      this.metaData.lyricist !== this.metaData.artist &&
      this.metaData.lyricist !== this.metaData.composer
    ) {
      return this.metaData.lyricist
    }
  }

  /**
   * For example: `https://musescore.com/score/1234`
   */
  get musescoreUrl (): string | undefined {
    if (this.metaData.musescore != null) {
      return `https://musescore.com/score/${this.metaData.musescore}`
    }
  }

  /**
   * Format: `subtitle - alias - country`
   */
  get subtitle (): string | undefined {
    const collection = SongMetaDataCombined.collectProperties(
      ['subtitle', 'alias', 'country'],
      this.metaData
    )
    if (collection.length > 0) {
      return collection.join(' - ')
    }
  }

  /**
   * title (year)
   */
  get title (): string {
    if (this.metaData.year != null) {
      return `${this.metaData.title} (${this.metaData.year})`
    }
    return this.metaData.title
  }

  /**
   * For example: `https://www.wikidata.org/wiki/Q42`
   */
  get wikidataUrl (): string | undefined {
    if (this.metaData.wikidata != null) {
      return formatWikidataUrl(this.metaData.wikidata)
    }
  }

  /**
   * For example: `https://en.wikipedia.org/wiki/A_Article`
   */
  get wikipediaUrl (): string | undefined {
    if (this.metaData.wikipedia != null) {
      return formatWikipediaUrl(this.metaData.wikipedia)
    }
  }

  /**
   * For example: `https://youtu.be/CQYypFMTQcE`
   */
  get youtubeUrl (): string | undefined {
    if (this.metaData.youtube != null) {
      return formatYoutubeUrl(this.metaData.youtube)
    }
  }

  toJSON (): StringIndexedObject {
    const output: StringIndexedObject = {
      title: this.title
    }
    if (this.subtitle != null) output.subtitle = this.subtitle
    if (this.composer != null) output.composer = this.composer
    if (this.lyricist != null) output.lyricist = this.lyricist
    return output
  }
}

export interface SongCollection<T> {
  [songId: string]: T
}

/**
 * The song library - a collection of songs
 */
export class CoreLibrary {
  /**
   * The collection of songs
   */
  songs: SongCollection<Song>

  /**
   * An array of song IDs.
   */
  songIds: string[]

  /**
   * The current index of the array this.songIds. Used for the methods
   * getNextSong and getPreviousSong
   */
  currentSongIndex: number

  constructor (songs: SongCollection<Song>) {
    this.songs = songs
    this.songIds = Object.keys(this.songs).sort(undefined)
    this.currentSongIndex = 0
  }

  toArray (): Song[] {
    return Object.values(this.songs)
  }

  toDynamicSelect (): DynamicSelectSong[] {
    const result = []
    for (const songId of this.songIds) {
      const song = this.getSongById(songId)
      result.push({ ref: song.songId, name: song.metaData.title })
    }
    return result
  }

  /**
   * Count the number of songs in the song library
   */
  countSongs (): number {
    return this.songIds.length
  }

  /**
   * Update the index of the song IDs array. If a song is opened via the search
   * form, it is possible to go to the next or previous song of the opened song.
   *
   * @returns The index in the songIds array.
   */
  updateCurrentSongIndex (songId: string): number {
    this.currentSongIndex = this.songIds.indexOf(songId)
    return this.currentSongIndex
  }

  /**
   * Get the song object from the song ID.
   *
   * @param songId - The ID of the song. (The parent song folder)
   */
  getSongById (songId: string): Song {
    if (songId in this.songs) {
      return this.songs[songId]
    } else {
      throw new Error(`There is no song with the songId: ${songId}`)
    }
  }

  /**
   * Get the previous song
   */
  getPreviousSong (): Song {
    if (this.currentSongIndex === 0) {
      this.currentSongIndex = this.countSongs() - 1
    } else {
      this.currentSongIndex -= 1
    }
    return this.getSongById(this.songIds[this.currentSongIndex])
  }

  /**
   * Get the next song
   */
  getNextSong (): Song {
    if (this.currentSongIndex === this.countSongs() - 1) {
      this.currentSongIndex = 0
    } else {
      this.currentSongIndex += 1
    }
    return this.getSongById(this.songIds[this.currentSongIndex])
  }

  /**
   * Get a random song.
   */
  getRandomSong (): Song {
    const randomIndex = Math.floor(Math.random() * this.songIds.length)
    if (this.currentSongIndex !== randomIndex) {
      return this.getSongById(this.songIds[randomIndex])
    } else {
      return this.getNextSong()
    }
  }

  toJSON (): StringIndexedObject {
    return this.songs
  }
}
