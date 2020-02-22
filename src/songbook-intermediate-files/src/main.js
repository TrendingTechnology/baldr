/**
 * This package bundles all objects functions together, which are used to
 * generate the intermediate files for the songbook. It has to be it’s own
 * package, because the dependency better-sqlite3 must be complied and that
 * causes trouble in the electron app.
 *
 * @module @bldr/songbook-intermediate-files
 */

// Node packages.
const childProcess = require('child_process')
const crypto = require('crypto')
const os = require('os')
const path = require('path')
const util = require('util')

// Third party packages.
const chalk = require('chalk')
const fs = require('fs-extra')
const glob = require('glob')
const Sqlite3 = require('better-sqlite3')
const yaml = require('js-yaml')

// Project packages.
const { AlphabeticalSongsTree, SongMetaDataCombined, CoreLibrary } = require('@bldr/songbook-core')
const core = require('@bldr/core-node')
const { formatMultiPartAssetFileName, camelToSnake } = require('@bldr/core-browser')

/**
 * See `/etc/baldr.json`.
 */
const config = core.bootstrapConfig()

/**
 * An array of song objects.
 * @typedef {module:@bldr/songbook-intermediate-files~Song[]} songs
 */

/*******************************************************************************
 * Functions
 ******************************************************************************/

function parseSongIDList (listPath) {
  const content = fs.readFileSync(listPath, { encoding: 'utf-8' })
  return content.split(/\s+/).filter(songId => songId)
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
    this.error = chalk.red('☒')
    this.finished = chalk.green('☑')
    this.progress = chalk.yellow('☐')
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
      forced = ' ' + chalk.red('(forced)')
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
      title = chalk.red(status.folderName)
    } else if (!status.changed.slides && !status.changed.piano) {
      title = chalk.green(status.folderName) + ': ' + song.metaData.title
    } else {
      title = chalk.yellow(status.folderName) + ': ' + song.metaData.title
    }

    let output = symbol + '  ' + title + forced
    if (status.generated.slides) {
      output +=
        '\n\t' +
        chalk.yellow('slides') +
        ': ' +
        status.generated.slides.join(', ')
    }

    if (status.generated.piano) {
      output +=
        '\n\t' +
        chalk.yellow('piano') +
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
     * A media server URI of a audio file for example (id:A_Song).
     *
     * @type {string}
     */
    this.audio = null

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
     * @type {array}
     */
    this.allowedProperties = [
      'alias',
      'arranger',
      'artist',
      'audio',
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

    /**
     * A Javascript object representation of the `info.yml` file.
     *
     * @type {Object}
     * @private
     */
    this.rawYaml_ = yaml.safeLoad(fs.readFileSync(ymlFile, 'utf8'))

    for (const key in this.rawYaml_) {
      if (!this.allowedProperties.includes(key)) {
        throw new Error(util.format('Unsupported key: %s', key))
      }
      this[key] = this.rawYaml_[key]
    }

    if (this.wikidata) {
      const wikidataID = parseInt(this.wikidata)
      if (isNaN(wikidataID)) {
        throw new Error(
          util.format(
            'Wikidata entry “%s” of song “%s” must be an number (without Q).',
            this.title,
            this.wikidata
          )
        )
      }
      return wikidataID
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
   * @param {string} projectorPath - Directory to store intermediate files for
   *   the projector app (*.svg, *.json).
   * @param {string} pianoPath - Directory to store intermediate files for
   *   the piano score (*.eps).
   */
  constructor (songPath, projectorPath, pianoPath) {

    /**
     * The directory containing the song files. For example
     * `/home/jf/songs/w/Wir-sind-des-Geyers-schwarze-Haufen`.
     *
     * @type {string}
     */
    this.folder = this.getSongFolder_(songPath)

    /**
     * The character of the alphabetical folder. The song folders must
     * be placed in alphabetical folders.
     *
     * @type {string}
     */
    this.abc = this.recognizeABCFolder_(this.folder)

    /**
     * The songId is the name of the directory which contains all song
     * files. It is used to sort the songs. It must be unique along all
     * songs. For example: `Wir-sind-des-Geyers-schwarze-Haufen`.
     *
     * @type {string}
     */
    this.songId = path.basename(this.folder)

    /**
     * An instance of the class SongMetaData().
     * @type {module:@bldr/songbook-intermediate-files~SongMetaData}
     */
    this.metaData = new SongMetaData(this.folder)

    /**
     * An instance of the class SongMetaDataCombined().
     * @type {module:@bldr/songbook-intermediate-files~SongMetaDataCombined}
     */
    this.metaDataCombined = new SongMetaDataCombined(this.metaData)

    /**
     * The slides folder
     *
     * @type {module:@bldr/songbook-intermediate-files~Folder}
     */
    this.folderSlides = null

    /**
     * Directory to store intermediate files for the projector app
     * (*.svg, *.json).
     *
     * @type {string}
     */
    this.projectorPath = projectorPath
    if (this.projectorPath) {
      this.projectorPath = this.getSongFolder_(this.projectorPath)
      this.folderSlides = new Folder(this.projectorPath)
    } else {
      this.folderSlides = new Folder(this.folder, 'slides')
    }

    /**
     * The piano folder
     *
     * @type {module:@bldr/songbook-intermediate-files~Folder}
     */
    this.folderPiano = null

    /**
     * Directory to store intermediate files for the piano score (*.eps).
     *
     * @type {string}
     */
    this.pianoPath = pianoPath
    if (this.pianoPath) {
      this.pianoPath = this.getSongFolder_(this.pianoPath)
      this.folderPiano = new Folder(this.pianoPath)
    } else {
      this.folderPiano = new Folder(this.folder, 'piano')
    }

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
     * An array of slides file in the SVG format. For example:
     * `[ '01.svg', '02.svg' ]`
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
   *
   * @private
   */
  getSongFolder_ (songPath) {
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
   *
   * @private
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
   *
   * @private
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
      songId: this.songId,
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
    if (song.songId in songs) {
      throw new Error(
        util.format('A song with the same songId already exists: %s',
          song.songId))
    }
    songs[song.songId] = song
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
   *
   * @private
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
    const songIds = parseSongIDList(listFile)
    const songs = {}
    for (const songId of songIds) {
      if ({}.hasOwnProperty.call(this.songs, songId)) {
        songs[songId] = this.songs[songId]
      } else {
        throw new Error(util.format('There is no song with song ID “%s”', songId))
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

/**
 * Check if executable is installed.
 *
 * @param {string} executable - Name of the executable.
 */
function checkExecutable (executable) {
  const exec = childProcess.spawnSync(executable, ['--help'])
  if (exec.status === null) {
    return false
  } else {
    return true
  }
}

/**
 * Check if executables are installed.
 *
 * @param {array} executables - Name of the executables.
 */
function checkExecutables (executables = []) {
  let status = true
  const unavailable = []
  executables.forEach((exec) => {
    const check = checkExecutable(exec)
    if (!check) {
      status = false
      unavailable.push(exec)
    }
  })
  return { status: status, unavailable: unavailable }
}

/**
 * A text file.
 */
class TextFile {
  /**
   * @param {string} path The path of the text file.
   */
  constructor (path) {
    /**
     * The path of the text file.
     * @type {string}
     */
    this.path = path
    this.flush()
  }

  /**
   * Append content to the text file.
   *
   * @param {string} content - Content to append to the text file.
   */
  append (content) {
    fs.appendFileSync(this.path, content)
  }

  /**
   * Read the whole text file.
   *
   * @return {string}
   */
  read () {
    return fs.readFileSync(this.path, { encoding: 'utf8' })
  }

  /**
   * Delete the content of the text file, not the text file itself.
   */
  flush () {
    fs.writeFileSync(this.path, '')
  }

  /**
   * Remove the text file.
   */
  remove () {
    fs.unlinkSync(this.path)
  }
}

/**
 * Sqlite database wrapper to store file contents hashes to detect
 * file modifications.
 */
class Sqlite {
  /**
   * @param {string} dbFile - The path of the Sqlite database.
   */
  constructor (dbFile) {
    /**
     * The path of the Sqlite database.
     *
     * @type {string}
     */
    this.dbFile = dbFile

    /**
     * A instance of the class “Sqlite3”.
     *
     * @type {module:@bldr/songbook-intermediate-files~Sqlite3}
     */
    this.db = new Sqlite3(this.dbFile)
    this.db
      .prepare(
        'CREATE TABLE IF NOT EXISTS hashes (filename TEXT UNIQUE, hash TEXT)'
      )
      .run()

    this.db
      .prepare('CREATE INDEX IF NOT EXISTS filename ON hashes(filename)')
      .run()
  }

  /**
   * Insert a hash value of a file.
   *
   * @param {string} filename - Name or path of a file.
   * @param {string} hash - The sha1 hash of the content of the file.
   */
  insert (filename, hash) {
    this.db
      .prepare('INSERT INTO hashes values ($filename, $hash)')
      .run({ filename: filename, hash: hash })
  }

  /**
   * Get the hast value of a file.
   *
   * @param {string} filename - Name or path of a file.
   */
  select (filename) {
    return this.db
      .prepare('SELECT * FROM hashes WHERE filename = $filename')
      .get({ filename: filename })
  }

  /**
   * Update the hash value of a file.
   *
   * @param {string} filename - Name or path of a file.
   * @param {string} hash - The sha1 hash of the content of the file.
   */
  update (filename, hash) {
    this.db
      .prepare('UPDATE hashes SET hash = $hash WHERE filename = $filename')
      .run({ filename: filename, hash: hash })
  }

  /**
   * Delete all rows from the table “hashes”.
   */
  flush () {
    this.db.prepare('DELETE FROM hashes').run()
  }
}

/**
 * Monitor files changes
 */
class FileMonitor {
  /**
   * @param {string} dbFile - The path where to store the Sqlite database.
   */
  constructor (dbFile) {
    this.db = new Sqlite(dbFile)
  }

  /**
   * Build the sha1 hash of a file.
   *
   * @param {string} filename - The path of the file.
   */
  hashSHA1 (filename) {
    return crypto
      .createHash('sha1')
      .update(
        fs.readFileSync(filename)
      )
      .digest('hex')
  }

  /**
   * Check for file modifications
   *
   * @param {string} filename - Path to the file.
   *
   * @returns {boolean}
   */
  isModified (filename) {
    filename = path.resolve(filename)
    if (!fs.existsSync(filename)) {
      return false
    }

    const hash = this.hashSHA1(filename)
    const row = this.db.select(filename)
    let hashStored = ''

    if (row) {
      hashStored = row.hash
    } else {
      this.db.insert(filename, hash)
    }
    if (hash !== hashStored) {
      this.db.update(filename, hash)
      return true
    } else {
      return false
    }
  }

  /**
   * Flush the file monitor database.
   */
  flush () {
    this.db.flush()
  }

  /**
   * Purge the file monitor database by deleting it.
   */
  purge () {
    if (fs.existsSync(this.db.dbFile)) fs.unlinkSync(this.db.dbFile)
  }
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
class PianoScore {
  /**
   * @param {module:@bldr/songbook-intermediate-files~Library} library - An instance of the class “Library()”
   * @param {boolean} groupAlphabetically
   * @param {boolean} pageTurnOptimized
   */
  constructor (library, groupAlphabetically = true, pageTurnOptimized = true) {
    /**
     * A temporary file path where the content of the TeX file gets stored.
     *
     * @type {string}
     */
    this.texFile = new TextFile(path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'baldr-songbook-')), 'songbook.tex'))

    /**
     * An instance of the class “Library()”.
     *
     * @type {module:@bldr/songbook-intermediate-files~Library}
     */
    this.library = library

    /**
     * @type {boolean}
     */
    this.groupAlphabetically = groupAlphabetically

    /**
     * @type {boolean}
     */
    this.pageTurnOptimized = pageTurnOptimized
  }

  /**
   * Generate TeX markup. Generate a TeX command prefixed with \tmp.
   *
   * @param {string} command
   * @param {string} value
   *
   * @return {string} A TeX markup, for example: \tmpcommand{value}\n
   */
  static texCmd (command, value) {
    let markupValue
    if (value) {
      markupValue = `{${value}}`
    } else {
      markupValue = ''
    }
    return `\\tmp${command}${markupValue}\n`
  }

  static sanitize (markup) {
    if (!markup) return ''
    return markup.replace('&', '\\&')
  }

  /**
   * Fill a certain number of pages with piano score files.
   *
   * @param {module:@bldr/songbook-intermediate-files~PianoFilesCountTree} countTree - Piano scores grouped by page number.
   * @param {module:@bldr/songbook-intermediate-files~songs} songs - An array of song objects.
   * @param {number} pageCount - Number of pages to group together.
   *
   * @returns {module:@bldr/songbook-intermediate-files~songs} An array of song objects, which fit in a given page number
   */
  static selectSongs (countTree, songs, pageCount) {
    for (let i = pageCount; i > 0; i--) {
      if (!countTree.isEmpty()) {
        const song = countTree.shift(i)
        if (song) {
          const missingPages = pageCount - i
          songs.push(song)
          if (missingPages <= 0) {
            return songs
          } else {
            return PianoScore.selectSongs(countTree, songs, missingPages)
          }
        }
      }
    }
    return songs
  }

  /**
   * Build the TeX markup of an array of song objects
   *
   * @param {module:@bldr/songbook-intermediate-files~songs} songs - An array of song objects.
   *
   * @return {string}
   */
  static buildSongList (songs, pageTurnOptimized = false) {
    const doublePages = []
    if (pageTurnOptimized) {
      let firstPage = true
      const countTree = new PianoFilesCountTree(songs)
      while (!countTree.isEmpty()) {
        // One page with two columns or two pages with 4 columns
        const doublePage = []
        let maxPages = 4
        let actualPages = 0
        if (firstPage) {
          maxPages = 2
          firstPage = false
        }
        const songs = PianoScore.selectSongs(countTree, [], maxPages)
        for (const song of songs) {
          actualPages = actualPages + song.pianoFiles.length
          doublePage.push(song.formatPianoTex())
        }
        // Do not add placeholder on the end of list.
        if (countTree.sumFiles() > maxPages) {
          // Add placeholder for blank pages
          const placeholder = PianoScore.texCmd('placeholder')
          const countPlaceholders = maxPages - actualPages
          // To avoid empty entries in the list: We use join later on.
          if (countPlaceholders) {
            for (let index = 0; index < countPlaceholders; index++) {
              doublePage.push(placeholder)
            }
          }
        }
        doublePages.push(doublePage.join('\\tmpcolumnbreak\n'))
      }
    } else {
      for (const song of songs) {
        doublePages.push(song.formatPianoTex())
      }
    }

    return doublePages.join('\\tmpcolumnbreak\n')
  }

  /**
   * Build the TeX markup for all songs.
   *
   * @param {boolean} groupAlphabetically
   * @param {boolean} pageTurnOptimized
   *
   * @returns {string}
   */
  build () {
    const output = []
    const songs = this.library.toArray()
    if (this.groupAlphabetically) {
      const abcTree = new AlphabeticalSongsTree(songs)
      Object.keys(abcTree).forEach((abc) => {
        output.push('\n\n' + PianoScore.texCmd('chapter', abc.toUpperCase()))
        output.push(PianoScore.buildSongList(abcTree[abc], this.pageTurnOptimized))
      })
    } else {
      output.push(PianoScore.buildSongList(songs, this.pageTurnOptimized))
    }
    return output.join('')
  }

  /**
   * Read the content of a text file.
   *
   * @param {filename} The name of the text (TeX) file inside this package
   *
   * @returns {string}
   *
   * @private
   */
  read_ (filename) {
    return fs.readFileSync(path.join(__dirname, filename), { encoding: 'utf8' })
  }

  /**
   * @private
   */
  spawnTex_ (texFile, cwd) {
    // Error on Mac OS: conversion of the eps files to pdf files doesn’t work.
    // not allowed in restricted mode.
    // --shell-escape
    const result = childProcess.spawnSync(
      'lualatex', ['--shell-escape', texFile],
      {
        cwd: cwd,
        encoding: 'utf-8'
      }
    )
    if (result.status !== 0) {
      throw new Error(result.stdout)
    }
  }

  /**
   * Compile the TeX file using lualatex and open the compiled pdf.
   */
  compile () {
    // Assemble the Tex markup.
    const style = this.read_('style.tex')
    const mainTexMarkup = this.read_('piano-all.tex')
    const songs = this.build()
    let texMarkup = mainTexMarkup.replace('//style//', style)
    texMarkup = texMarkup.replace('//songs//', songs)
    texMarkup = texMarkup.replace('//created//', new Date().toLocaleString())
    let basePath = this.library.basePath
    if (this.library.pianoPath) {
      basePath = this.library.pianoPath
    }
    texMarkup = texMarkup.replace('//basepath//', basePath)

    // Write contents to the text file.
    core.log(
      'The TeX markup was written to: %s', // Do not change text: This will break tests.
      this.texFile.path // No color: This will break tests.
    )
    this.texFile.append(texMarkup)

    // To avoid temporary TeX files in the working directory of the shell
    // the command is running from.
    const cwd = path.dirname(this.texFile.path)

    // Compile the TeX file
    // Compile twice for the table of contents
    // The page numbers in the toc only matches after three runs.
    for (let index = 0; index < 3; index++) {
      core.log(
        'Compile the TeX file “%s” the %d time.',
        chalk.yellow(this.texFile.path),
        index + 1
      )
      this.spawnTex_(this.texFile.path, cwd)
    }

    // Open the pdf file.
    const pdfFile = this.texFile.path.replace('.tex', '.pdf')
    let openCommand
    if (os.platform() === 'darwin') {
      openCommand = 'open'
    } else {
      openCommand = 'xdg-open'
    }
    const child = childProcess.spawn(
      openCommand,
      [pdfFile],
      { detached: true, stdio: 'ignore' }
    )
    child.unref()
  }
}

/**
 * Extended version of the Song class to build intermediate files.
 */
class IntermediateSong extends Song {
  /**
   * @param {string} songPath - The path of the directory containing the song
   * files or a path of a file inside the song folder (not nested in subfolders)
   * @param {string} projectorPath - Directory to store intermediate files for
   *   the projector app (*.svg, *.json).
   * @param {string} pianoPath - Directory to store intermediate files for
   *   the piano score (*.eps).
   * @param {module:@bldr/songbook-intermediate-files~FileMonitor} fileMonitor - A instance
   * of the FileMonitor() class.
   */
  constructor (songPath, projectorPath, pianoPath, fileMonitor) {
    super(songPath, projectorPath, pianoPath)

    /**
     * A instance of the FileMonitor class.
     *
     * @type {module:@bldr/songbook-intermediate-files~FileMonitor}
     */
    this.fileMonitor = fileMonitor
  }

  /**
   * Format one image file of a piano score in the TeX format.
   *
   * @param {number} index The index number of the array position
   *
   * @return {string} TeX markup for one EPS image file of a piano score.
   *
   * @private
   */
  formatPianoTeXEpsFile_ (index) {
    let subFolder
    if (!this.pianoPath) {
      subFolder = path.join(this.abc, this.songId, 'piano', this.pianoFiles[index])
    } else {
      subFolder = path.join(this.abc, this.songId, this.pianoFiles[index])
    }
    return PianoScore.texCmd(
      'image',
      subFolder
    )
  }

  /**
   * Generate TeX markup for one song.
   *
   * @return {string} TeX markup for a single song.
   * <code><pre>
   * \tmpmetadata
   * {title} % title
   * {subtitle} % subtitle
   * {composer} % composer
   * {lyricist} % lyricist
   * \tmpimage{s/Swing-low/piano/piano_1.eps}
   * \tmpimage{s/Swing-low/piano/piano_2.eps}
   * \tmpimage{s/Swing-low/piano/piano_3.eps}
   * </pre><code>
   */
  formatPianoTex () {
    if (this.pianoFiles.length === 0) {
      throw new Error(util.format(
        'The song “%s” has no EPS piano score files.',
        this.metaData.title))
    }
    if (this.pianoFiles.length > 4) {
      throw new Error(util.format(
        'The song “%s” has more than 4 EPS piano score files.',
        this.metaData.title))
    }
    const template = `\n\\tmpmetadata
{%s} % title
{%s} % subtitle
{%s} % composer
{%s} % lyricist
`
    const output = util.format(
      template,
      PianoScore.sanitize(this.metaDataCombined.title),
      PianoScore.sanitize(this.metaDataCombined.subtitle),
      PianoScore.sanitize(this.metaDataCombined.composer),
      PianoScore.sanitize(this.metaDataCombined.lyricist)
    )
    const epsFiles = []
    for (let i = 0; i < this.pianoFiles.length; i++) {
      epsFiles.push(this.formatPianoTeXEpsFile_(i))
    }
    return output + epsFiles.join('\\tmpcolumnbreak\n')
  }

  /**
   * Generate form a given *.mscx file a PDF file.
   *
   * @param {string} source - Name of the *.mscx file without the extension.
   * @param {string} destination - Name of the PDF without the extension.
   *
   * @private
   */
  generatePDF_ (source, destination = '') {
    if (destination === '') {
      destination = source
    }
    const pdf = path.join(this.folderSlides.get(), destination + '.pdf')
    childProcess.spawnSync('mscore', [
      '--export-to',
      path.join(pdf),
      path.join(this.folder, source + '.mscx')
    ])
    if (fs.existsSync(pdf)) {
      return destination + '.pdf'
    } else {
      return false
    }
  }

  /**
   * Generate svg files in a 'slides' subfolder.
   *
   * @param {string} folder - A song folder.
   *
   * @private
   */
  generateSlides_ () {
    const dest = this.folderSlides.get()
    const oldSVGs = listFiles(dest, '.svg')
    for (const oldSVG of oldSVGs) {
      fs.unlinkSync(path.join(dest, oldSVG))
    }
    const src = path.join(dest, 'projector.pdf')
    childProcess.spawnSync('pdf2svg', [
      src,
      path.join(dest, '%02d.svg'),
      'all'
    ])
    fs.unlinkSync(src)
    const result = listFiles(dest, '.svg')
    if (!result) {
      throw new Error('The SVG files for the slides couldn’t be generated.')
    }
    this.slidesFiles = result
    return result
  }

  /**
   * Generate from the MuseScore file “piano/piano.mscx” EPS files.
   *
   * @return {array} An array of EPS piano score filenames.
   *
   * @private
   */
  generatePiano_ () {
    this.folderPiano.empty()
    const dest = this.folderPiano.get()
    const pianoFile = path.join(dest, 'piano.mscx')
    fs.copySync(this.mscxPiano, pianoFile)
    childProcess.spawnSync('mscore-to-vector.sh', ['-e', pianoFile])
    const result = listFiles(dest, '.eps')
    if (!result) {
      throw new Error('The EPS files for the piano score couldn’t be generated.')
    }
    this.pianoFiles = result
    return result
  }

  /**
   * Wrapper method for all process methods of one song folder.
   *
   * @param {string} mode - Generate all intermediate media files or only slide
   *   and piano files. Possible values: “all”, “slides” or “piano”
   * @param {boolean} force - Force the regeneration of intermediate files.
   */
  generateIntermediateFiles (mode = 'all', force = false) {
    const status = { changed: {}, generated: {} }

    status.folder = this.folder
    status.folderName = path.basename(this.folder)

    status.force = force
    status.changed.slides = this.fileMonitor.isModified(this.mscxProjector)

    // slides
    if ((mode === 'all' || mode === 'slides') &&
        (force || status.changed.slides || !this.slidesFiles.length)) {
      status.generated.projector = this.generatePDF_('projector')
      status.generated.slides = this.generateSlides_()
    }

    status.changed.piano = this.fileMonitor.isModified(this.mscxPiano)

    // piano
    if ((mode === 'all' || mode === 'piano') &&
        (force || status.changed.piano || !this.pianoFiles.length)) {
      status.generated.piano = this.generatePiano_()
    }

    return status
  }

  /**
   * Delete all generated files of a song folder.
   */
  cleanIntermediateFiles () {
    const files = [
      'piano',
      'slides',
      'projector.pdf'
    ]
    files.forEach(
      (file) => {
        fs.removeSync(path.join(this.folder, file))
      }
    )
  }
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
class PianoFilesCountTree {
  /**
   * @param {module:@bldr/songbook-intermediate-files~songs} songs - An array of song objects.
   */
  constructor (songs) {
    this.validCounts_ = [1, 2, 3, 4]
    this.build_(songs)
  }

  /**
   * @param {number} count - 1, 2, 3, 4
   *
   * @private
   */
  checkCount_ (count) {
    if (this.validCounts_.includes(count)) {
      return true
    } else {
      throw new Error(util.format('Invalid piano file count: %s', count))
    }
  }

  /**
   * @param {module:@bldr/songbook-intermediate-files~songs} songs - An array of song objects.
   *
   * @private
   */
  build_ (songs) {
    for (const song of songs) {
      const count = song.pianoFiles.length
      if (!(count in this)) this[count] = []
      this[count].push(song)
    }
  }

  /**
   * Sum up the number of all songs in all count categories.
   */
  sum () {
    let count = 0
    for (const validCount of this.validCounts_) {
      if ({}.hasOwnProperty.call(this, validCount)) {
        count = count + this[validCount].length
      }
    }
    return count
  }

  /**
   * Sum up the number of files of all songs in all count categories.
   */
  sumFiles () {
    let count = 0
    for (const validCount of this.validCounts_) {
      if ({}.hasOwnProperty.call(this, validCount)) {
        count += validCount * this[validCount].length
      }
    }
    return count
  }

  /**
   * Return true if the count tree has no songs.
   *
   * @return {boolean}
   */
  isEmpty () {
    if (this.sum() === 0) {
      return true
    } else {
      return false
    }
  }

  /**
   * Shift the array of songs that has ”count” number of piano files.
   *
   * @param {number} count - 1, 2, 3, 4
   *
   * @returns {module:@bldr/songbook-intermediate-files~Song}
   */
  shift (count) {
    this.checkCount_(count)
    if ({}.hasOwnProperty.call(this, count)) return this[count].shift()
  }
}

class IntermediateLibrary extends Library {
  /**
   * @param {string} basePath - The base path of the song library
   * @param {string} projectorPath - Directory to store intermediate files for
   *   the projector app (*.svg, *.json).
   * @param {string} pianoPath - Directory to store intermediate files for
   *   the piano score (*.eps).
   */
  constructor (basePath, projectorPath, pianoPath) {
    super(basePath)

    /**
     * Directory to store intermediate files for the projector app
     * (*.svg, *.json).
     *
     * @type {string}
     */
    this.projectorPath = projectorPath

    /**
     * Directory to store intermediate files for the piano score (*.eps).
     *
     * @type {string}
     */
    this.pianoPath = pianoPath

    /**
     * A instance of the FileMonitor class.
     *
     * @type {module:@bldr/songbook-intermediate-files~FileMonitor}
     */
    this.fileMonitor = new FileMonitor(path.join(this.basePath,
      'filehashes.db'))

    /**
     * @type {object}
     */
    this.songs = this.collectSongs_()
  }

  /**
   * Execute git pull if repository exists.
   */
  gitPull () {
    if (fs.existsSync(path.join(this.basePath, '.git'))) {
      return childProcess.spawnSync('git', ['pull'], { cwd: this.basePath })
    }
    return false
  }

  /**
   * @private
   */
  collectSongs_ () {
    const songs = {}
    for (const songPath of this.detectSongs_()) {
      let projectorPath = null
      if (this.projectorPath) projectorPath = path.join(this.projectorPath, songPath)
      let pianoPath = null
      if (this.pianoPath) pianoPath = path.join(this.pianoPath, songPath)
      const song = new IntermediateSong(
        path.join(this.basePath, songPath),
        projectorPath,
        pianoPath,
        this.fileMonitor
      )
      if (song.songId in songs) {
        throw new Error(
          util.format('A song with the same songId already exists: %s',
            song.songId))
      }
      songs[song.songId] = song
    }
    return songs
  }

  /**
   * Delete multiple files.
   *
   * @param {array} files - An array of files to delete.
   *
   * @private
   */
  deleteFiles_ (files) {
    files.forEach(
      (file) => {
        fs.removeSync(path.join(this.basePath, file))
      }
    )
  }

  /**
   * Clean all intermediate media files.
   */
  cleanIntermediateFiles () {
    for (const songId in this.songs) {
      this.songs[songId].cleanIntermediateFiles()
    }
    this.deleteFiles_([
      'songs.tex',
      'filehashes.db'
    ])
  }

  /**
   * Calls the method generateIntermediateFiles on each song
   *
   * @param {string} mode - Generate all intermediate media files or only slide
   *   and piano files. Possible values: “all”, “slides” or “piano”
   * @param {boolean} force - Force the regeneration of intermediate files.
   */
  generateIntermediateFiles (mode = 'all', force = false) {
    for (const songId in this.songs) {
      const song = this.songs[songId]
      const status = song.generateIntermediateFiles(mode, force)
      message.songFolder(status, song)
    }
  }

  /**
   * Generate all intermediate media files for one song.
   *
   * @param {string} folder - The path of the parent song folder.
   * @param {string} mode - Generate all intermediate media files or only slide
   *   and piano files. Possible values: “all”, “slides” or “piano”
   */
  updateSongByPath (folder, mode = 'all') {
    // To throw an error if the folder doesn’t exist.
    fs.lstatSync(folder)
    const song = new IntermediateSong(folder, null, null, this.fileMonitor)
    const status = song.generateIntermediateFiles(mode, true)
    message.songFolder(status, song)
  }

  /**
   * Generate all intermediate media files for one song.
   *
   * @param {string} songId - The ID of the song (the name of the parent song folder)
   * @param {string} mode - Generate all intermediate media files or only slide
   *   and piano files. Possible values: “all”, “slides” or “piano”
   */
  updateSongBySongId (songId, mode = 'all') {
    let song
    if ({}.hasOwnProperty.call(this.songs, songId)) {
      song = this.songs[songId]
    } else {
      throw new Error(util.format('The song with the song ID “%s” is unkown.', songId))
    }
    const status = song.generateIntermediateFiles(mode, true)
    message.songFolder(status, song)
  }

  /**
   * Update the whole song library.
   *
   * @param {string} mode - Generate all intermediate media files or only slide
   *   and piano files. Possible values: “all”, “slides” or “piano”
   * @param {boolean} force - Force the regeneration of intermediate files.
   */
  update (mode = 'all', force = false) {
    if (!['all', 'slides', 'piano'].includes(mode)) {
      throw new Error('The parameter “mode” must be one of this strings: ' +
        '“all”, “slides” or “piano”.')
    }
    this.gitPull()
    this.generateIntermediateFiles(mode, force)
  }
}

/**
 * Export the intermediate SVG files to the media server. Adjust the
 * `info.yml` and copy it to the destination folder of the media server.
 */
function exportToMediaServer (library) {
  // NB = Notenbeispiele -> SVG
  // /var/data/baldr/media/Lieder/NB
  // There exists a folder for the audio files: HB (Hörbeispiele)
  const dirBase = path.join(config.mediaServer.basePath, 'Lieder', 'NB')
  try {
    fs.rmdirSync(dirBase)
  } catch (error) {}
  fs.ensureDirSync(dirBase)

  function exportSong (song) {
    // /var/data/baldr/media/Lieder/NB/a
    const dirAbc = path.join(dirBase, song.abc)
    fs.ensureDirSync(dirAbc)

    const firstFileName = path.join(dirAbc, `${song.songId}.svg`)

    // song.slidesFiles: ['01.svg', '02.svg']
    for (let index = 0; index < song.slidesFiles.length; index++) {
      const src = path.join(song.folderSlides.get(), song.slidesFiles[index])
      const dest = formatMultiPartAssetFileName(firstFileName, index + 1)
      fs.copySync(src, dest)
      console.log(`Copy ${chalk.yellow(src)} to ${chalk.green(dest)}.`)
    }

    const rawYaml = song.metaData.rawYaml_
    rawYaml.id = `Lied_${song.songId}_NB`
    rawYaml.title = `Lied „${song.metaData.title}“`

    for (const property of song.metaDataCombined.allProperties) {
      if (song.metaDataCombined[property]) {
        rawYaml[`${camelToSnake(property)}_combined`] = song.metaDataCombined[property]
      }
    }

    const yamlMarkup = ['---', yaml.safeDump(rawYaml)]
    fs.writeFileSync(`${firstFileName}.yml`, yamlMarkup.join('\n'))
  }

  for (const song of library.toArray()) {
    exportSong(song)
  }
}

/**
 * Build the Vue app. All image files must be copied into the Vue working
 * directory.
 */
function buildVueApp () {
  const process = childProcess.spawnSync('npm', ['run', 'build'], {
    cwd: config.songbook.vueAppPath,
    encoding: 'utf-8',
    shell: true
  })
  console.log(process.stdout)
  console.log(process.stderr)
}

exports.buildVueApp = buildVueApp
exports.checkExecutables = checkExecutables
exports.exportToMediaServer = exportToMediaServer
exports.IntermediateLibrary = IntermediateLibrary
exports.PianoScore = PianoScore
