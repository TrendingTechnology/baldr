/**
 * @file A collection of function and classes not using the DOM
 * @module @bldr/songbook-base
 */

'use strict'

// Node packages.
const os = require('os')
const path = require('path')
const util = require('util')

// Third party packages.
const fs = require('fs-extra')
const glob = require('glob')
const yaml = require('js-yaml')
require('colors')

const { SongMetaDataCombined, CoreLibrary } = require('@bldr/songbook-core')

/**
 * An array of song objects.
 * @typedef {module:baldr-songbook~Song[]} songs
 */

/*******************************************************************************
 * Functions
 ******************************************************************************/

/**
 * By default this module reads the config file ~/.baldr.json to generate its
 * config object.
 */
function bootstrapConfig () {
  const configDefault = {
    force: false
  }

  // default object
  let config = configDefault

  // config file
  const configFile = path.join(os.homedir(), '.baldr.json')
  const configFileExits = fs.existsSync(configFile)
  if (configFileExits) {
    config = Object.assign(config, require(configFile).songbook)
  }

  if (process.env.BALDR_SONGBOOK_PATH) {
    config.path = process.env.BALDR_SONGBOOK_PATH
  }

  if (!config.path || config.path.length === 0) {
    message.noConfigPath()
  }
  return config
}

function parseSongIDList (listPath) {
  const content = fs.readFileSync(listPath, { encoding: 'utf-8' })
  return content.split(/\s+/).filter(songID => songID)
}

/**
 * List files in a a directory. You have to use a filter to
 * select the files.
 *
 * @param {string} basePath - A directory
 * @param {string} filter - String to filter, e. g. “.eps”
 *
 * @return {array} An array of file names.
 */
function listFiles (basePath, filter) {
  if (fs.existsSync(basePath)) {
    return fs.readdirSync(basePath).filter((file) => {
      return file.indexOf(filter) > -1
    })
  }
  return []
}

/*******************************************************************************
 * Utility classes
 ******************************************************************************/

class Message {
  constructor () {
    this.error = '☒'.red
    this.finished = '☑'.green
    this.progress = '☐'.yellow
  }

  /**
   * Print out and return text.
   *
   * @param {string} text - Text to display.
   */
  print (text) {
    console.log(text)
    return text
  }

  /**
   *
   */
  noConfigPath () {
    let output = this.error + '  Configuration file ' +
      '“~/.baldr.json” not found!\n' +
      'Create such a config file or use the “--base-path” option!'

    const sampleConfig = fs.readFileSync(
      path.resolve(__dirname, '..', 'sample.config.json'), 'utf8'
    )
    output += '\n\nExample configuration file:\n' + sampleConfig

    this.print(output)
    throw new Error('No configuration file found.')
  }

  /**
   * @param {object} status
   * <pre><code>
   * {
   *   "changed": {
   *     "piano": false,
   *     "slides": false
   *   },
   *   "folder": "songs/a/Auf-der-Mauer",
   *   "folderName": "Auf-der-Mauer",
   *   "force": true,
   *   "generated": {
   *     "piano": [
   *       "piano_1.eps",
   *       "piano_2.eps"
   *     ],
   *     "projector": "projector.pdf",
   *     "slides": [
   *       "01.svg",
   *       "02.svg"
   *     ],
   *   },
   *   "info": {
   *     "title": "Auf der Mauer, auf der Lauer"
   *   }
   * }
   * </code></pre>
   */
  songFolder (status, song) {
    let forced
    if (status.force) {
      forced = ' ' + '(forced)'.red
    } else {
      forced = ''
    }

    let symbol
    if (!song.metaData.title) {
      symbol = this.error
    } else if (!status.changed.slides && !status.changed.piano) {
      symbol = this.finished
    } else {
      symbol = this.progress
    }

    let title
    if (!song.metaData.title) {
      title = status.folderName.red
    } else if (!status.changed.slides && !status.changed.piano) {
      title = status.folderName.green + ': ' + song.metaData.title
    } else {
      title = status.folderName.yellow + ': ' + song.metaData.title
    }

    let output = symbol + '  ' + title + forced
    if (status.generated.slides) {
      output +=
        '\n\t' +
        'slides'.yellow +
        ': ' +
        status.generated.slides.join(', ')
    }

    if (status.generated.piano) {
      output +=
        '\n\t' +
        'piano'.yellow +
        ': ' +
        status.generated.piano.join(', ')
    }
    this.print(output)
  }
}

const message = new Message()

/**
 * A wrapper class for a folder.
 */
class Folder {
  /**
   * @param {...string} folderPath - The path segments of the folder
   */
  constructor (folderPath) {
    /**
     * The path of the folder.
     * @type {string}
     */
    this.folderPath = path.join(...arguments)
    if (!fs.existsSync(this.folderPath)) {
      fs.mkdirSync(this.folderPath, { recursive: true })
    }
  }

  /**
   * Return the path of the folder.
   *
   * @returns {string}
   */
  get () {
    return this.folderPath
  }

  /**
   * Empty the folder (Delete all it’s files).
   */
  empty () {
    fs.removeSync(this.folderPath)
    fs.mkdirSync(this.folderPath)
  }

  /**
   * Remove the folder.
   */
  remove () {
    fs.removeSync(this.folderPath)
  }
}

/*******************************************************************************
 * Song classes
 ******************************************************************************/

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
class SongMetaData {
  /**
   * @param {string} folder - Path of the song folder.
   */
  constructor (folder) {
    /**
     * Alias for a song title, e. g. “Sehnsucht nach dem Frühlinge” “Komm,
     * lieber Mai, und mache”
     *
     * @type {string}
     */
    this.alias = null

    /**
     * The arranger of a song.
     *
     * @type {string}
     */
    this.arranger = null

    /**
     * The artist of a song.
     *
     * @type {string}
     */
    this.artist = null

    /**
     * The composer of a song.
     *
     * @type {string}
     */
    this.composer = null

    /**
     * The country the song is from.
     *
     * @type {string}
     */
    this.country = null

    /**
     * A longer text which describes the song.
     *
     * @type {string}
     */
    this.description = null

    /**
     * The genre of the song.
     *
     * @type {string}
     */
    this.genre = null

    /**
     * The lyricist of the song.
     *
     * @type {string}
     */
    this.lyricist = null

    /**
     * The MuseScore score ID from musescore.com, for example the score ID
     * from https://musescore.com/user/1601631/scores/1299601 is 1299601.
     *
     * @type {string}
     */
    this.musescore = null

    /**
     * A text or a URL which describes the source of a song.
     *
     * @type {string}
     */
    this.source = null

    /**
     * The subtitle of a song.
     *
     * @type {string}
     */
    this.subtitle = null

    /**
     * The title of a song.
     *
     * @type {string}
     */
    this.title = null

    /**
     * The Wikidata data item ID (without the Q prefix)
     *
     * @type {string}
     */
    this.wikidata = null

    /**
     * ID of a wikipedia article (e. g. en:A_Article)
     *
     * @type {string}
     */
    this.wikipedia = null

    /**
     * The year the song was released.
     *
     * @type {string}
     */
    this.year = null

    /**
     * The youtube ID (e. g. CQYypFMTQcE)
     *
     * @type {string}
     */
    this.youtube = null

    /**
     * The file name of the YAML file.
     *
     * @type {string}
     */
    this.yamlFile = 'info.yml'

    /**
     * All in the YAML file “info.yml” allowed properties (keys).
     *
     * @type {arry}
     */
    this.allowedProperties = [
      'alias',
      'arranger',
      'artist',
      'composer',
      'country',
      'description',
      'genre',
      'lyricist',
      'musescore',
      'source',
      'subtitle',
      'title',
      'wikidata',
      'wikipedia',
      'year',
      'youtube'
    ]

    if (!fs.existsSync(folder)) {
      throw new Error(util.format('Song folder doesn’t exist: %s', folder))
    }

    /**
     * The path of then parent song folder.
     *
     * @type {string}
     */
    this.folder = folder

    const ymlFile = path.join(folder, this.yamlFile)
    if (!fs.existsSync(ymlFile)) {
      throw new Error(util.format('YAML file could not be found: %s', ymlFile))
    }
    const raw = yaml.safeLoad(fs.readFileSync(ymlFile, 'utf8'))

    for (const key in raw) {
      if (!this.allowedProperties.includes(key)) {
        throw new Error(util.format('Unsupported key: %s', key))
      }
      this[key] = raw[key]
    }
  }

  toJSON () {
    const output = {}
    for (const key of this.allowedProperties) {
      if (this[key]) {
        output[key] = this[key]
      }
    }
    return output
  }
}

/**
 * One song
 */
class Song {
  /**
   * @param {string} songPath - The path of the directory containing the song
   * files or a path of a file inside the song folder (not nested in subfolders)
   */
  constructor (songPath) {
    /**
     * The directory containing the song files.
     *
     * @type {string}
     */
    this.folder = this.normalizeSongFolder_(songPath)

    /**
     * The character of the alphabetical folder. The song folders must
     * be placed in alphabetical folders.
     *
     * @type {string}
     */
    this.abc = this.recognizeABCFolder_(this.folder)

    /**
     * The songID is the name of the directory which contains all song
     * files. It is used to sort the songs. It must be unique along all
     * songs.
     *
     * @type {string}
     */
    this.songID = path.basename(this.folder)

    /**
     * An instance of the class SongMetaData().
     * @type {module:baldr-songbook~SongMetaData}
     */
    this.metaData = new SongMetaData(this.folder)

    /**
     * An instance of the class SongMetaDataCombined().
     * @type {module:baldr-songbook~SongMetaDataCombined}
     */
    this.metaDataCombined = new SongMetaDataCombined(this.metaData)

    /**
     * The slides folder
     *
     * @type {module:baldr-songbook~Folder}
     */
    this.folderSlides = new Folder(this.folder, 'slides')

    /**
     * The piano folder
     *
     * @type {module:baldr-songbook~Folder}
     */
    this.folderPiano = new Folder(this.folder, 'piano')

    /**
     * Path of the MuseScore file 'projector.mscx', relative to the base folder
     * of the song collection.
     *
     * @type string
     */
    this.mscxProjector = this.detectFile_('projector.mscx')

    /**
     * Path of the MuseScore file for the piano parts, can be 'piano.mscx'
     * or 'lead.mscx', relative to the base folder
     * of the song collection.
     *
     * @type string
     */
    this.mscxPiano = this.detectFile_('piano.mscx', 'lead.mscx')

    /**
     * An array of piano score pages in the EPS format.
     *
     * @type {array}
     */
    this.pianoFiles = listFiles(this.folderPiano.get(), '.eps')

    /**
     * An array of slides file in the SVG format.
     *
     * @type {array}
     */
    this.slidesFiles = listFiles(this.folderSlides.get(), '.svg')
  }

  /**
   * Get the song folder.
   *
   * @param {string} songPath - The path of the directory containing the song
   *   files or a path of a file inside the song folder (not nested in
   *   subfolders) or a non-existing song path.
   *
   * @return {string} The path of the parent directory of the song.
   */
  normalizeSongFolder_ (songPath) {
    try {
      const stat = fs.lstatSync(songPath)
      if (stat.isDirectory()) {
        return songPath
      } else if (stat.isFile()) {
        return path.dirname(songPath)
      }
    } catch (error) {
      return songPath.replace(`${path.sep}info.yml`, '')
    }
  }

  /**
   * @param {string} folder - The directory containing the song files.
   *
   * @return {string} A single character
   */
  recognizeABCFolder_ (folder) {
    const pathSegments = folder.split(path.sep)
    const abc = pathSegments[pathSegments.length - 2]
    return abc
  }

  /**
   * Detect a file inside the song folder. Throw an exception if the
   * file doesn’t exist.
   *
   * @param {string} file - A filename of a file inside the song folder.
   *
   * @return A joined path of the file relative to the song collection
   *   base dir.
   */
  detectFile_ (file) {
    let absPath
    for (const argument of arguments) {
      absPath = path.join(this.folder, argument)
      if (fs.existsSync(absPath)) {
        return absPath
      }
    }
    throw new Error(util.format('File doesn’t exist: %s', absPath))
  }

  toJSON () {
    return {
      abc: this.abc,
      folder: this.folder,
      metaData: this.metaData,
      songID: this.songID,
      slidesCount: this.slidesFiles.length
    }
  }
}

/**
 * Collect all songs of a song tree by walking through the folder tree
 * structur.
 *
 * @returns {object} An object indexed with the song ID containing the song
 * objects.
 */
function collectSongs (basePath) {
  const songsPaths = glob.sync('info.yml', { cwd: basePath, matchBase: true })
  const songs = {}
  for (const songPath of songsPaths) {
    const song = new Song(path.join(basePath, songPath))
    if (song.songID in songs) {
      throw new Error(
        util.format('A song with the same songID already exists: %s',
          song.songID))
    }
    songs[song.songID] = song
  }
  return songs
}

/*******************************************************************************
 * Classes for multiple songs
 ******************************************************************************/

/**
 * The song library - a collection of songs
 */
class Library extends CoreLibrary {
  /**
   * @param {string} - The base path of the song library
   */
  constructor (basePath) {
    super(collectSongs(basePath))

    /**
     * The base path of the song library
     *
     * @type {string}
     */
    this.basePath = basePath
  }

  /**
   * Identify a song folder by searching for a file named “info.yml.”
   */
  detectSongs_ () {
    return glob.sync('info.yml', { cwd: this.basePath, matchBase: true })
  }

  /**
   * @param {string} listFile
   *
   * @returns {pbject}
   */
  loadSongList (listFile) {
    const songIDs = parseSongIDList(listFile)
    const songs = {}
    for (const songID of songIDs) {
      if ({}.hasOwnProperty.call(this.songs, songID)) {
        songs[songID] = this.songs[songID]
      } else {
        throw new Error(util.format('There is no song with song ID “%s”', songID))
      }
    }
    this.songs = songs
    return songs
  }

  /**
   * Return only the existing ABC folders.
   *
   * @return {Array}
   */
  getABCFolders_ () {
    const abc = '0abcdefghijklmnopqrstuvwxyz'.split('')
    return abc.filter((file) => {
      const folder = path.join(this.basePath, file)
      if (fs.existsSync(folder) && fs.statSync(folder).isDirectory()) {
        return true
      } else {
        return false
      }
    })
  }
}

exports.listFiles = listFiles
exports.bootstrapConfig = bootstrapConfig
exports.Library = Library
exports.message = message
exports.parseSongIDList = parseSongIDList
exports.Song = Song
exports.Folder = Folder
