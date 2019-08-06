/**
 * @file Core functionality for the BALDR songbook without a node dependency.
 * @module @bldr/songbook-core
 */

/**
 * Sort alphabetically an array of objects by some specific property.
 *
 * @param {String} property Key of the object to sort.
 * @see {@link https://ourcodeworld.com/articles/read/764/how-to-sort-alphabetically-an-array-of-objects-by-key-in-javascript Tutorial}
 */
function sortObjectsByProperty (property) {
  return function (a, b) {
    return a[property].localeCompare(b[property])
  }
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
class AlphabeticalSongsTree {
  /**
   * @param {module:baldr-songbook~songs} songs - An array of song objects.
   */
  constructor (songs) {
    for (const song of songs) {
      if (!{}.hasOwnProperty.call(this, song.abc)) this[song.abc] = []
      this[song.abc].push(song)
    }
    for (const abc in this) {
      this[abc].sort(sortObjectsByProperty('songID'))
    }
  }
}

/**
 * Combine some song metadata properties
 *
 * Mapping
 *
 * * title: title (year)
 * * subtitle: subtitle - alias - country
 * * composer: composer, artist, genre
 * * lyricist: lyricist
 */
class SongMetaDataCombined {
  /**
   * @param {module:baldr-songbook~SongMetaData} songMetaData - A song
   * metadata object.
   */
  constructor (songMetaData) {
    this.metaData = songMetaData
  }

  /**
   * Extract values of given properties of an object and collect it in
   * an array.
   *
   * @params {array} properties - Some object properties to collect strings from.
   * @params {object} object - An object.
   */
  static collectProperties_ (properties, object) {
    const parts = []
    for (const property of properties) {
      if (property in object && object[property]) {
        parts.push(object[property])
      }
    }
    return parts
  }

  /**
   * title (year)
   */
  get title () {
    let out
    if ('title' in this.metaData) {
      out = this.metaData.title
    } else {
      out = ''
    }

    if ('year' in this.metaData && this.metaData.year) {
      return `${out} (${this.metaData.year})`
    } else {
      return out
    }
  }

  /**
   * subtitle - alias - country
   */
  get subtitle () {
    return SongMetaDataCombined.collectProperties_(
      ['subtitle', 'alias', 'country'],
      this.metaData
    ).join(' - ')
  }

  /**
   * composer, artist, genre
   */
  get composer () {
    let properties
    if (this.metaData.composer === this.metaData.artist) {
      properties = ['composer', 'genre']
    } else {
      properties = ['composer', 'artist', 'genre']
    }
    return SongMetaDataCombined.collectProperties_(
      properties,
      this.metaData
    ).join(', ')
  }

  /**
   * lyricist
   */
  get lyricist () {
    if (
      'lyricist' in this.metaData &&
      this.metaData.lyricist &&
      this.metaData.lyricist !== this.metaData.artist &&
      this.metaData.lyricist !== this.metaData.composer
    ) {
      return this.metaData.lyricist
    } else {
      return ''
    }
  }

  toJSON () {
    return {
      title: this.title,
      subtitle: this.subtitle,
      composer: this.composer,
      lyricist: this.lyricist
    }
  }
}

exports.AlphabeticalSongsTree = AlphabeticalSongsTree