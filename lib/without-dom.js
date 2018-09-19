const fs = require('fs');
const path = require('path');

/**
 *
 */
class Library {

  constructor(filePath) {
    this.tree = JSON.parse(fs.readFileSync(filePath));

    /**
     * @return {array} Array of folder paths.
     * <code><pre>
     * {
     *   "Aint-she-sweet": {
     *     "title": "Ain’t she sweet",
     *     "artist": "Milton Ager (1893 - 1979)",
     *     "lyricist": "Jack Yellen",
     *     "folder": "/home/jf/git-repositories/content/lieder/a/Aint-she-sweet",
     *     "slides": [
     *       "01.svg",
     *       "02.svg"
     *     ]
     *   },
     *   "Altes-Fieber": {
     *     "title": "Altes Fieber",
     *     "artist": "Die Toten Hosen",
     *     "musescore": "https://musescore.com/user/12559861/scores/4801717",
     *     "folder": "/home/jf/git-repositories/content/lieder/a/Altes-Fieber",
     *     "slides": [
     *       "01.svg",
     *       "02.svg",
     *       "03.svg",
     *       "04.svg",
     *       "05.svg",
     *       "06.svg"
     *     ]
     *   },
     *   "Always-look-on-the-bright-side": {
     *     "title": "Always look on the bright side of life",
     *     "source": "http://musescore.com/score/158089",
     *     "folder": "/home/jf/git-repositories/content/lieder/a/Always-look-on-the-bright-side",
     *     "slides": [
     *       "01.svg",
     *       "02.svg",
     *       "03.svg",
     *       "04.svg",
     *       "05.svg",
     *       "06.svg"
     *     ]
     *   },
     * </pre></code>
     */
    this.list = Library.flattenTree_(this.tree);
  }

  /**
   * @return {array} Array of folder paths.
   * <code><pre>
   * {
   *   "Aint-she-sweet": {
   *     "title": "Ain’t she sweet",
   *     "artist": "Milton Ager (1893 - 1979)",
   *     "lyricist": "Jack Yellen",
   *     "folder": "/home/jf/git-repositories/content/lieder/a/Aint-she-sweet",
   *     "slides": [
   *       "01.svg",
   *       "02.svg"
   *     ]
   *   },
   *   "Altes-Fieber": {
   *     "title": "Altes Fieber",
   *     "artist": "Die Toten Hosen",
   *     "musescore": "https://musescore.com/user/12559861/scores/4801717",
   *     "folder": "/home/jf/git-repositories/content/lieder/a/Altes-Fieber",
   *     "slides": [
   *       "01.svg",
   *       "02.svg",
   *       "03.svg",
   *       "04.svg",
   *       "05.svg",
   *       "06.svg"
   *     ]
   *   },
   *   "Always-look-on-the-bright-side": {
   *     "title": "Always look on the bright side of life",
   *     "source": "http://musescore.com/score/158089",
   *     "folder": "/home/jf/git-repositories/content/lieder/a/Always-look-on-the-bright-side",
   *     "slides": [
   *       "01.svg",
   *       "02.svg",
   *       "03.svg",
   *       "04.svg",
   *       "05.svg",
   *       "06.svg"
   *     ]
   *   },
   * </pre></code>
   */
  static flattenTree_(tree) {
    var newTree = {};
    Object.keys(tree).forEach((abc, index) => {
      Object.keys(tree[abc]).forEach((folder, index) => {
        newTree[folder] = tree[abc][folder];
      });
    });
    return newTree;
  }

  getSongById(songID) {
    return this.list[songID];
  }
}

/**
 * info.yml
 *
 *     ---
 *     title: Lemon tree
 *     subtitle:
 *     alias: I’m sitting here
 *     artist: Fools Garden
 *     lyricist:
 *     composer: Heinz Müller / Manfred Meier
 *     country: Deutschland
 *     musescore: https://musescore.com/user/12559861/scores/4801717
 *     source: http://wikifonia.org/node/9928/revisions/13488/view
 *     year: 1965
 *     genre: Spiritual
 *
 * # Mapping
 *
 * * title: title (year)
 * * subtitle: subtitle - alias - country
 * * composer: composer, artist, genre
 * * lyricist: lyricist
 */
class SongMetaData {

  constructor(info) {
    this.rawInfo = info;
  }

  /**
   * Extract values of given properties of an object and collect it in
   * an array.
   */
  static collectProperties_(properties, object) {
    let parts = [];
    for (let property of properties) {
      if (property in object) {
        parts.push(object[property]);
      }
    }
    return parts;
  }

  /**
   * title (year)
   */
  get title() {
    let out;
    if ('title' in this.rawInfo) {
      out = this.rawInfo.title;
    }
    else {
      out = '';
    }

    if ('year' in this.rawInfo) {
      return `${out} (${this.rawInfo.year})`;
    }
    else {
      return out;
    }

  }

  /**
   * subtitle - alias - country
   */
  get subtitle() {
    return SongMetaData.collectProperties_(
      ['subtitle', 'alias', 'country'],
      this.rawInfo
    ).join(' - ');
  }

  /**
   * composer, artist, genre
   */
  get composer() {
    return SongMetaData.collectProperties_(
      ['composer', 'artist', 'genre'],
      this.rawInfo
    ).join(', ');
  }

  /**
   * lyricist
   */
  get lyricist() {
    if ('lyricist' in this.rawInfo) {
      return this.rawInfo.lyricist;
    }
    else {
      return '';
    }
  }
}

exports.Library = Library;
exports.SongMetaData = SongMetaData;
