import { sortObjectsByProperty } from '@bldr/universal-utils'

import { Song, DynamicSelectSong } from './song'

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
      if (!{}.hasOwnProperty.call(this, song.abc)) {
        this[song.abc] = []
      }
      this[song.abc].push(song)
    }
    for (const abc in this) {
      this[abc].sort(sortObjectsByProperty('songId'))
    }
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

  toJSON (): Record<string, any> {
    return this.songs
  }
}
