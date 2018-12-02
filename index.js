#! /usr/bin/env node

/**
 * @file Command line interface to generate the intermediate media files
 * for the BALDR songbook.
 * @module baldr-songbook-updater
 */

'use strict'

const commander = require('commander')
const crypto = require('crypto')
const fs = require('fs-extra')
const glob = require('glob')
const os = require('os')
const path = require('path')
const pckg = require('./package.json')
const spawn = require('child_process').spawnSync
const Sqlite3 = require('better-sqlite3')
const util = require('util')
const yaml = require('js-yaml')
require('colors')

/***********************************************************************
 * Functions
 **********************************************************************/

/**
 *
 */
function texCmd (command, value) {
  return '\\tmp' + command + '{' + value + '}\n'
}

/**
 * Check if executable is installed.
 * @param {string} executable - Name of the executable.
 */
function checkExecutable (executable) {
  let exec = spawn(executable, ['--help'])
  if (exec.status === null) {
    return false
  } else {
    return true
  }
}

/**
 * Check if executables are installed.
 * @param {array} executables - Name of the executables.
 */
function checkExecutables (executables = []) {
  let status = true
  let unavailable = []
  executables.forEach((exec) => {
    let check = checkExecutable(exec)
    if (!check) {
      status = false
      unavailable.push(exec)
    }
  })
  return { 'status': status, 'unavailable': unavailable }
}

/**
 * By default this module reads the config file ~/.baldr to
 * generate its config object.
 */
function bootstrapConfig () {
  let { status, unavailable } = checkExecutables([
    'mscore-to-eps.sh',
    'pdf2svg',
    'pdfcrop',
    'pdfinfo',
    'pdftops',
    'mscore'
  ])

  if (!status) {
    let e = new Error(
      'Some dependencies are not installed: “' +
      unavailable.join('”, “') +
      '”'
    )
    e.name = 'UnavailableCommandsError'
    throw e
  }

  const configDefault = {
    force: false
  }

  // default object
  let config = configDefault

  // config file
  let configFile = path.join(os.homedir(), '.baldr.json')
  let configFileExits = fs.existsSync(configFile)
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

function parseCliArguments (argv) {
  return commander
    .version(pckg.version)
    .option('-c, --clean', 'clean up (delete all generated files)')
    .option('-F, --folder <folder>', 'process only the given song folder')
    .option('-f, --force', 'rebuild all images')
    .option('-b --base-path <base-path>', 'Base path of a song collection.')
    .option('-p, --piano', 'Generate the piano files only.')
    .option('-s, --slides', 'Generate the slides only.')
    .parse(argv)
}

/***********************************************************************
 * Utility classes
 **********************************************************************/

class Message {
  constructor () {
    this.error = '☒'.red
    this.finished = '☑'.green
    this.progress = '☐'.yellow
  }

  /**
   * Print out and return text.
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
      path.join(__dirname, 'sample.config.json'), 'utf8'
    )
    output += '\n\nExample configuration file:\n' + sampleConfig

    this.print(output)
    throw new Error('No configuration file found.')
  }

  /**
   *
   * @param {object} status
   * <pre><code>
   * {
   *   "changed": {
   *     "piano": false,
   *     "slides": false
   *   },
   *   "folder": "songs/a/Auf-der-Mauer_auf-der-Lauer",
   *   "folderName": "Auf-der-Mauer_auf-der-Lauer",
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

let message = new Message()

/**
 * Build a TeX file (songs.tex) of all piano scores.
 */
class TeXFile {
  /**
   * @param {string} path The path of the TeXFile.
   */
  constructor (path) {
    this.path = path
    this.flush()
  }

  /**
   * Append content to the TeX file.
   *
   * @param {string} content - Content to append to the Tex file.
   */
  append (content) {
    fs.appendFileSync(this.path, content)
  }

  /**
   * Remove the TeX file.
   */
  remove () {
    fs.unlinkSync(this.path)
  }

  /**
   * Delete the content of the TeX file, not the TeX file itself.
   */
  flush () {
    fs.writeFileSync(this.path, '')
  }

  /**
   * Read the complete TeX file
   *
   * @return {string}
   */
  read () {
    return fs.readFileSync(this.path, { encoding: 'utf8' })
  }
}

/**
 *
 */
class Folder {
  /**
   * @param {...string} folderPath - The path segments of the folder
   */
  constructor (folderPath) {
    this.folderPath = path.join(...arguments)
    if (!fs.existsSync(this.folderPath)) {
      fs.mkdirSync(this.folderPath)
    }
  }

  /**
   * Remove the folder
   */
  remove () {
    fs.removeSync(this.folderPath)
  }

  /**
   * Empty the folder (Delete all it’s files)
   */
  empty () {
    fs.removeSync(this.folderPath)
    fs.mkdirSync(this.folderPath)
  }

  /**
   * Return the path of the folder
   *
   * @returns {string}
   */
  get () {
    return this.folderPath
  }
}

/**
 * Sqlite database wrapper to store file contents hashes to detect
 * file modifications.
 */
class Sqlite {
  /**
   * @param {string} dbFile - The path where to store the Sqlite database.
   */
  constructor (dbFile) {
    this.dbFile = dbFile
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
      .run({ 'filename': filename, 'hash': hash })
  }

  /**
   * Get the hast value of a file.
   *
   * @param {string} filename - Name or path of a file.
   */
  select (filename) {
    return this.db
      .prepare('SELECT * FROM hashes WHERE filename = $filename')
      .get({ 'filename': filename })
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
      .run({ 'filename': filename, 'hash': hash })
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

    let hash = this.hashSHA1(filename)
    let row = this.db.select(filename)
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

/***********************************************************************
 * Song classes
 **********************************************************************/

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
     * Alias for a song title, e. g. “Sehnsucht nach dem Frühlinge” “Komm, lieber Mai, und mache”
     * @type {string}
     */
    this.alias = null

    /**
     * .
     * @type {string}
     */
    this.arranger = null

    /**
     * .
     * @type {string}
     */
    this.artist = null

    /**
     * .
     * @type {string}
     */
    this.composer = null

    /**
     * .
     * @type {string}
     */
    this.country = null

    /**
     * .
     * @type {string}
     */
    this.genre = null

    /**
     * .
     * @type {string}
     */
    this.lyricist = null

    /**
     * .
     * @type {string}
     */
    this.musescore = null

    /**
     * .
     * @type {string}
     */
    this.source = null

    /**
     * .
     * @type {string}
     */
    this.subtitle = null

    /**
     * .
     * @type {string}
     */
    this.title = null

    /**
     * .
     * @type {string}
     */
    this.year = null

    /**
     * The file name of the YAML file.
     * @type {string}
     */
    this.yamlFile = 'info.yml'

    /**
     * All in the YAML file “info.yml” allowed properties (keys).
     * @type {arry}
     */
    this.allowedProperties = [
      'alias',
      'arranger',
      'artist',
      'composer',
      'country',
      'genre',
      'lyricist',
      'musescore',
      'source',
      'subtitle',
      'title',
      'year'
    ]

    if (!fs.existsSync(folder)) {
      throw new Error(util.format('Song folder doesn’t exist: %s', folder))
    }

    /**
     * The path of then parent song folder.
     * @type {string}
     */
    this.folder = folder

    let ymlFile = path.join(folder, this.yamlFile)
    if (!fs.existsSync(ymlFile)) {
      throw new Error(util.format('YAML file could not be found: %s', ymlFile))
    }
    let raw = yaml.safeLoad(fs.readFileSync(ymlFile, 'utf8'))

    for (let key in raw) {
      if (!this.allowedProperties.includes(key)) {
        throw new Error(util.format('Unsupported key: %s', key))
      }
      this[key] = raw[key]
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
   * @param {module:baldr-songbook-updater~SongMetaData} songMetaData - A song
   * metadata object.
   */
  constructor (songMetaData) {
    this.metaData = songMetaData
  }

  /**
   * Extract values of given properties of an object and collect it in
   * an array.
   */
  static collectProperties_ (properties, object) {
    let parts = []
    for (let property of properties) {
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
    return SongMetaDataCombined.collectProperties_(
      ['composer', 'artist', 'genre'],
      this.metaData
    ).join(', ')
  }

  /**
   * lyricist
   */
  get lyricist () {
    if ('lyricist' in this.metaData && this.metaData.lyricist) {
      return this.metaData.lyricist
    } else {
      return ''
    }
  }
}

/**
 * One song
 */
class Song {
  /**
   * @param {string} songPath - The path of the directory containing the song files
   * or a path of a file inside the song folder (not nested in subfolders )
   * @param {module:baldr-songbook-updater~FileMonitor} fileMonitor - A instance of the FileMonitor() class.
   */
  constructor (songPath, fileMonitor) {
    /**
     * The directory containing the song files.
     * @type {string}
     */
    this.folder = this.normalizeSongFolder_(songPath)

    /**
     * A instance of the FileMonitor class.
     * @type {module:baldr-songbook-updater~FileMonitor}
     */
    this.fileMonitor = fileMonitor

    /**
     * The character of the alphabetical folder. The song folders must
     * be placed in alphabetical folders.
     * @type {string}
     */
    this.abc = this.recognizeABCFolder_(this.folder)

    /**
     * The songID is the name of the directory which contains all song
     * files. It is used to sort the songs. It must be unique along all
     * songs.
     * @type {string}
     */
    this.songID = path.basename(this.folder)

    /**
     * An instance of the class SongMetaData().
     * @type {module:baldr-songbook-updater~SongMetaData}
     */
    this.metaData = new SongMetaData(this.folder)

    /**
     * An instance of the class SongMetaDataCombined().
     * @type {module:baldr-songbook-updater~SongMetaDataCombined}
     */
    this.metaDataCombined = new SongMetaDataCombined(this.metaData)

    /**
     * The slides folder
     * @type {module:baldr-songbook-updater~Folder}
     */
    this.folderSlides = new Folder(this.folder, 'slides')

    /**
     * The piano folder
     * @type {module:baldr-songbook-updater~Folder}
     */
    this.folderPiano = new Folder(this.folder, 'piano')

    /**
     * Path of the MuseScore file 'projector.mscx', relative to the base folder
     * of the song collection.
     * @type string
     */
    this.mscxProjector = this.detectFile_('projector.mscx')

    /**
     * Path of the MuseScore file for the piano parts, can be 'piano.mscx'
     * or 'lead.mscx', relative to the base folder
     * of the song collection.
     * @type string
     */
    this.mscxPiano = this.detectFile_('piano.mscx', 'lead.mscx')
  }

  /**
   * @param {string} songPath - The path of the directory containing the song files
   * or a path of a file inside the song folder (not nested in subfolders)
   *
   * @return {string} The path of the parent directory of the song.
   */
  normalizeSongFolder_ (songPath) {
    if (fs.lstatSync(songPath).isDirectory()) {
      return songPath
    } else {
      return path.dirname(songPath)
    }
  }

  /**
   * @param {string} folder - The directory containing the song files.
   *
   * @return {string} A single character
   */
  recognizeABCFolder_ (folder) {
    let pathSegments = folder.split(path.sep)
    let abc = pathSegments[pathSegments.length - 2]
    return abc
  }

  /**
   * Generate TeX markup for one song.
   *
   * @return {string} TeX markup for a single song.
   * <code><pre>
   * \tmpheading{Swing low}
   * \tmpimage{s/Swing-low/piano/piano_1.eps}
   * \tmpimage{s/Swing-low/piano/piano_2.eps}
   * \tmpimage{s/Swing-low/piano/piano_3.eps}
   * </pre><code>
   */
  formatPianoTex () {
    let relativeSongPath = path.join(this.abc, this.songID)
    const eps = this.getFolderFiles_('piano', '.eps')
    let output = ''

    output += '\n' + texCmd('heading', this.metaDataCombined.title)
    eps.forEach(
      (file) => {
        output += texCmd('image', path.join(relativeSongPath, 'piano', file))
      }
    )
    return output
  }

  /**
   * Detect a file inside the song folder. Throw an exception if the
   * file doesn’t exist.
   *
   *  @param {string} file - A filename of a file inside the song folder.
   *
   * @return A joined path of the file relative to the song collection
   *   base dir.
   */
  detectFile_ (file) {
    let absPath
    for (let argument of arguments) {
      absPath = path.join(this.folder, argument)
      if (fs.existsSync(absPath)) {
        return absPath
      }
    }
    throw new Error(util.format('File doesn’t exist: %s', absPath))
  }

  /**
   * @param {string} subFolder - A subfolder relative to this.folder
   * @param {string} filter - String to filter.
   */
  getFolderFiles_ (subFolder, filter) {
    let folder = path.join(this.folder, subFolder)
    if (fs.existsSync(folder)) {
      return fs.readdirSync(folder).filter((file) => {
        return file.indexOf(filter) > -1
      })
    } else {
      return []
    }
  }

  /**
   * Generate form a given *.mscx file a PDF file.
   * @param {string} source - Name of the *.mscx file without the extension.
   * @param {string} destination - Name of the PDF without the extension.
   */
  generatePDF_ (source, destination = '') {
    if (destination === '') {
      destination = source
    }
    let pdf = path.join(this.folder, destination + '.pdf')
    spawn('mscore', [
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
   * @param {string} folder - A song folder.
   */
  generateSlides_ () {
    this.folderSlides.empty()
    spawn('pdf2svg', [
      path.join(this.folder, 'projector.pdf'),
      path.join(this.folderSlides.get(), '%02d.svg'),
      'all'
    ])
    return this.getFolderFiles_('slides', '.svg')
  }

  /**
   * Generate a PDF named piano.pdf a) from piano.mscx or b) from lead.mscx
   * @param {string} folder - A song folder.
   */
  generatePiano_ () {
    this.folderPiano.empty()
    let pianoFile = path.join(this.folderPiano.get(), 'piano.mscx')
    fs.copySync(this.mscxPiano, pianoFile)
    spawn('mscore-to-eps.sh', [pianoFile])
    return this.getFolderFiles_('piano', '.eps')
  }

  /**
   * Wrapper method for all process methods of one song folder.
   * @param {boolean} force - Force the generation of media files.
   */
  generateIntermediateFiles (force = false) {
    let status = { changed: {}, generated: {} }

    status.folder = this.folder
    status.folderName = path.basename(this.folder)

    status.force = force
    status.changed.slides = this.fileMonitor.isModified(
      path.join(this.folder, 'projector.mscx')
    )
    // projector
    if (force || status.changed.slides) {
      status.generated.projector = this.generatePDF_('projector')
      status.generated.slides = this.generateSlides_()
    }

    if (
      this.fileMonitor.isModified(path.join(this.folder, 'lead.mscx')) ||
        this.fileMonitor.isModified(path.join(this.folder, 'piano.mscx'))
    ) {
      status.changed.piano = true
    } else {
      status.changed.piano = false
    }

    // piano
    if (force || status.changed.piano) {
      status.generated.piano = this.generatePiano_()
    }
    return status
  }

  /**
   * Delete all generated files of a song folder.
   */
  cleanIntermediateFiles () {
    let files = [
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

/***********************************************************************
 * Song library - collection of songs
 **********************************************************************/

/**
 * The song library - a collection of songs
 */
class Library {
  /**
   * @param {string} - The base path of the song library
   */
  constructor (basePath) {
    /**
     * The base path of the song library
     * @type {string}
     */
    this.basePath = basePath

    /**
     * A instance of the FileMonitor class.
     * @type {module:baldr-songbook-updater~FileMonitor}
     */
    this.fileMonitor = new FileMonitor(path.join(this.basePath, 'filehashes.db'))

    /**
     * The collection of songs
     * @type {object}
     */
    this.songs = {}
    for (let songPath of this.detectSongs_()) {
      let song = new Song(path.join(this.basePath, songPath), this.fileMonitor)
      if (song.songID in this.songs) {
        throw new Error(util.format('A song with the same songID already exists: %s', song.songID))
      }
      this.songs[song.songID] = song
    }
  }

  /**
   * Identify a song folder by searching for a file named “info.yml.”
   */
  detectSongs_ () {
    return glob.sync('info.yml', { cwd: this.basePath, matchBase: true })
  }

  /**
   * Execute git pull if repository exists.
   */
  gitPull () {
    if (fs.existsSync(path.join(this.basePath, '.git'))) {
      return spawn('git', ['pull'], { cwd: this.basePath })
    } else {
      return false
    }
  }

  /**
   * Return only the existing ABC folders.
   *
   * @return {Array}
   */
  getABCFolders_ () {
    let abc = '0abcdefghijklmnopqrstuvwxyz'.split('')
    return abc.filter((file) => {
      let folder = path.join(this.basePath, file)
      if (fs.existsSync(folder) && fs.statSync(folder).isDirectory()) {
        return true
      } else {
        return false
      }
    })
  }

  /**
   * Sort alphabetically an array of objects by some specific property.
   *
   * @param {String} property Key of the object to sort.
   * @see {@link https://ourcodeworld.com/articles/read/764/how-to-sort-alphabetically-an-array-of-objects-by-key-in-javascript Tutorial}
   */
  sortByProperty_ (property) {
    return function (a, b) {
      return a[property].localeCompare(b[property])
    }
  }

  /**
   * Build a song tree where the songs are placed in alphabetical
   * folders.
   *
   * @return {object} - A tree object like this:
   * <pre><code>
   * {
   *   "a": [ song, song ],
   *   "s": [ song, song ],
   *   "z": [ song, song ]
   * }
   * </code></pre>
   */
  buildAlphabeticalSongTree () {
    let tree = {}
    for (let songID in this.songs) {
      let song = this.songs[songID]
      if (!tree.hasOwnProperty(song.abc)) tree[song.abc] = []
      tree[song.abc].push(song)
    }
    for (let abc in tree) {
      tree[abc].sort(this.sortByProperty_('songID'))
    }
    return tree
  }

  /**
   * Get the song object from the song ID.
   *
   * @param {string} songID - The ID of the song. (The parent song folder)
   *
   * @return {module:baldr-songbook-updater~Song}
   */
  getSongById (songID) {
    if (songID in this.songs && this.songs[songID]) {
      return this.songs[songID]
    } else {
      throw new Error(util.format('There is no song with the songID: %s', songID))
    }
  }

  /**
   * Delete multiple files.
   *
   * @param {array} files - An array of files to delete.
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
    for (let songID in this.songs) {
      this.songs[songID].cleanIntermediateFiles()
    }
    this.deleteFiles_([
      'songs.tex',
      'filehashes.db'
    ])
  }

  /**
   * Calls the method generateIntermediateFiles on each song
   *
   * @param {boolean} force - Force the regeneration of intermediate files.
   */
  generateIntermediateFiles (force = false) {
    for (let songID in this.songs) {
      let song = this.songs[songID]
      let status = song.generateIntermediateFiles(force)
      message.songFolder(status, song)
    }
  }

  /**
   * Generate all intermediate media files for one song.
   *
   * @param {string} folder - The path of the parent song folder.
   */
  updateSongFolder (folder) {
    let song = new Song(folder, this.fileMonitor)
    let status = song.generateIntermediateFiles(true)
    message.songFolder(status, song)
  }

  /**
   * Build a tree object which contains the number of piano files of
   * each song. This tree is necessary to avoid page breaks on multipage
   * piano scores.
   *
   * @return {object}
   * <code><pre>
   * { a: { '3': { 'Auf-der-Mauer_auf-der-Lauer': [Object] } },
   *   s:
   *    { '1': { 'Stille-Nacht': [Object] },
   *      '3': { 'Swing-low': [Object] } },
   *   z: { '2': { 'Zum-Tanze-da-geht-ein-Maedel': [Object] } } }
   * </pre><code>
   *
   * One song entry has following properties:
   *
   * <code><pre>
   * { title: 'Swing low',
   *   folder: '/test/songs/processed/some/s/Swing-low',
   *   slides: [ '01.svg', '02.svg', '03.svg' ],
   *   pianoFiles: [ 'piano_1.eps', 'piano_2.eps', 'piano_3.eps' ] }
   * </pre><code>
   */
  buildPianoFilesCountTree () {
    let output = {}
    let tree = this.buildAlphabeticalSongTree()
    Object.keys(tree).forEach((abc, index) => {
      for (let i = 0; i < tree[abc].length; i++) {
        let song = tree[abc][i]
        let pianoFiles = song.getFolderFiles_('piano', '.eps')
        let count = pianoFiles.length
        if (!(abc in output)) output[abc] = {}
        if (!(count in output[abc])) output[abc][count] = []
        output[abc][count].push(song)
      }
    })
    return output
  }

  /**
   * Generate the TeX file for the piano version of the songbook.
   */
  generateTeX () {
    let tree = this.buildAlphabeticalSongTree()
    let texFile = new TeXFile(path.join(this.basePath, 'songs.tex'))

    Object.keys(tree).forEach((abc, index) => {
      texFile.append('\n\n' + texCmd('chapter', abc.toUpperCase()))
      for (let i = 0; i < tree[abc].length; i++) {
        let song = tree[abc][i]
        texFile.append(song.formatPianoTex())
      }
    })
  }

  /**
   * Update the whole song library.
   */
  update () {
    this.gitPull()
    this.generateIntermediateFiles()
    this.generateTeX()
  }
}

/**
 * Main function: This function gets executed when the script is called
 * on the command line.
 */
let main = function () {
  let options = parseCliArguments(process.argv)

  if (options.folder) {
    options.force = true
  }

  let config = bootstrapConfig()

  if (options.path && options.basePath.length > 0) {
    config.path = options.basePath
  }

  let library = new Library(config.path)

  if (options.clean) {
    library.cleanIntermediateFiles()
  } else if (options.folder) {
    library.updateSongFolder(options.folder)
  } else if (options.tex) {
    library.generateTeX()
  } else {
    library.update()
  }
}

if (require.main === module) {
  main()
}
