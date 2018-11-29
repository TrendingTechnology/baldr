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

const json = require('./json.js')
const folderTree = require('./tree.js')

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
      'Create such a config file or use the “--path” option!'

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
  songFolder (status) {
    let forced
    if (status.force) {
      forced = ' ' + '(forced)'.red
    } else {
      forced = ''
    }

    let symbol
    if (!status.info.title) {
      symbol = this.error
    } else if (!status.changed.slides && !status.changed.piano) {
      symbol = this.finished
    } else {
      symbol = this.progress
    }

    let title
    if (!status.info.title) {
      title = status.folderName.red
    } else if (!status.changed.slides && !status.changed.piano) {
      title = status.folderName.green + ': ' + status.info.title
    } else {
      title = status.folderName.yellow + ': ' + status.info.title
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
 * Check if executable is installed.
 * @param {string} executable - Name of the executable.
 */
let checkExecutable = function (executable) {
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
let checkExecutables = function (executables = []) {
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
 * Execute git pull if repository exists.
 *
 * To get changed files:
 * git diff-tree --no-commit-id --name-only -r <commit-ish>
 * git diff-tree --no-commit-id --name-only -r babeae91638b55978b99ee5eb49ac2bf361df51e c11e2736edf1c6f6be47eeaa58fa172beedd6e0c
 * git diff-tree --no-commit-id --name-only -r ba03fc103f962f8274b50aade61c99214d26e918 c11e2736edf1c6f6be47eeaa58fa172beedd6e0c
 *
 * Get current commit id:
 * git rev-parse HEAD
 */
let gitPull = function (basePath) {
  if (fs.existsSync(path.join(basePath, '.git'))) {
    return spawn('git', ['pull'], { cwd: basePath })
  } else {
    return false
  }
}

/***********************************************************************
 * index
 **********************************************************************/

const configDefault = {
  force: false
}

let config = {}

/**
 * By default this module reads the config file ~/.baldr to
 * generate its config object.
 * @param {object} newConfig - An object containing the same properties as the
 * config object.
 */
let bootstrapConfig = function (newConfig = false) {
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

  // default object
  config = configDefault

  // config file
  let configFile = path.join(os.homedir(), '.baldr.json')
  let configFileExits = fs.existsSync(configFile)
  if (configFileExits) {
    config = Object.assign(config, require(configFile).songbook)
  }

  // function parameter
  if (newConfig) {
    config = Object.assign(config, newConfig)
  }

  if (process.env.BALDR_SONGBOOK_PATH) {
    config.path = process.env.BALDR_SONGBOOK_PATH
  }

  if (!config.path || config.path.length === 0) {
    message.noConfigPath()
  }
}

let updateSongFolder = function (folder, fileMonitor) {
  let status = new SongFiles(folder, fileMonitor).generateIntermediateFiles()
  message.songFolder(status)
}

/**
 * Update and generate when required media files for the songs.
 */
let update = function (basePath, fileMonitor) {
  gitPull(basePath)
  folderTree.flat(basePath).forEach((songFolder) => {
    updateSongFolder(songFolder, fileMonitor)
  })
  json.generateJSON(basePath)
  let tex = new TeX(basePath)
  tex.generateTeX()
}

/**
 *
 */
let cleanFiles = function (folder, files) {
  files.forEach(
    (file) => {
      fs.removeSync(path.join(folder, file))
    }
  )
}

/**
 * Clean all temporary files in a song folder.
 * @param {string} folder - A song folder.
 */
let cleanFolder = function (folder) {
  cleanFiles(folder, [
    'piano',
    'slides',
    'projector.pdf'
  ])
}

/**
 * Clean all temporary media files.
 */
let clean = function () {
  folderTree.flat(config.path).forEach(cleanFolder)

  cleanFiles(config.path, [
    'songs.json',
    'songs.tex',
    'filehashes.db'
  ])
}

let generateJSON = function (basePath) {
  json.generateJSON(basePath)
}

let generateTeX = function (basePath) {
  let tex = new TeX(basePath)
  tex.generateTeX()
}

let setOptions = function (argv) {
  return commander
    .version(pckg.version)
    .option('-c, --clean', 'clean up (delete all generated files)')
    .option('-F, --folder <folder>', 'process only the given song folder')
    .option('-f, --force', 'rebuild all images')
    .option('-j, --json', 'generate JSON file')
    .option('-p --path <path>', 'Base path to a song collection.')
    .option('-t, --tex', 'generate TeX file')
    .parse(argv)
}

/***********************************************************************
 * Utility classes
 **********************************************************************/

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

/**
 * Build a TeX file (songs.tex) of all piano scores.
 */
class TeX {
  /**
   * @param {string} basePath The base path of the song collection.
   */
  constructor (basePath) {
    this.basePath = basePath
    this.outputFile = path.join(basePath, 'songs.tex')
  }

  /**
   * Build a tree object which contains the number of piano files of
   * each song. This tree is necessary to avoid page breaks on multipage
   * piano scores.
   *
   * @param {object} tree The object of songs.json
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
  buildPianoFilesCountTree (tree) {
    let output = {}
    Object.keys(tree).forEach((abc, index) => {
      Object.keys(tree[abc]).forEach((songFolder, index) => {
        let absSongFolder = path.join(this.basePath, abc, songFolder, 'piano')
        let pianoFiles = folderTree.getFolderFiles_(absSongFolder, '.eps')
        let count = pianoFiles.length
        if (!(abc in output)) output[abc] = {}
        if (!(count in output[abc])) output[abc][count] = {}
        output[abc][count][songFolder] = tree[abc][songFolder]
        output[abc][count][songFolder].pianoFiles = pianoFiles
      })
    })
    return output
  }

  /**
   *
   */
  texCmd (command, value) {
    return '\\tmp' + command + '{' + value + '}\n'
  }

  /**
   * Generate TeX markup for one song.
   *
   * @param {string} basePath Base path of the song collection.
   * @param {string} songFolder Path of a single song.
   * @return {string} TeX markup for a single song.
   * <code><pre>
   * \tmpheading{Swing low}
   * \tmpimage{s/Swing-low/piano/piano_1.eps}
   * \tmpimage{s/Swing-low/piano/piano_2.eps}
   * \tmpimage{s/Swing-low/piano/piano_3.eps}
   * </pre><code>
   */
  texSong (songPath) {
    let basePath = path.resolve(this.basePath)
    let resolvedSongPath = path.resolve(songPath)
    let relativeSongPath = resolvedSongPath
      .replace(basePath, '')
      .replace(/^\//, '')
    const info = folderTree.getSongInfo(resolvedSongPath)
    const eps = folderTree.getFolderFiles_(path.join(resolvedSongPath, 'piano'), '.eps')
    let output = ''

    if (info.hasOwnProperty('title') && eps.length > 0) {
      output += '\n' + this.texCmd('heading', info.title)
      eps.forEach(
        (file) => {
          output += this.texCmd('image', path.join(relativeSongPath, 'piano', file))
        }
      )
    }
    return output
  }

  /**
   *
   */
  texABC (abc) {
    return '\n\n' + this.texCmd('chapter', abc.toUpperCase())
  }

  /**
   * Generate TeX file for the piano version of the songbook.
   */
  generateTeX () {
    const tree = folderTree.getTree(this.basePath)
    fs.removeSync(this.outputFile)

    Object.keys(tree).forEach((abc, index) => {
      fs.appendFileSync(this.outputFile, this.texABC(abc))

      Object.keys(tree[abc]).forEach((folder, index) => {
        fs.appendFileSync(this.outputFile, this.texSong(path.join(this.basePath, abc, folder)))
      })
    })
  }
}

/***********************************************************************
 * Song classes
 **********************************************************************/

/**
 * Generate all temporary files of a single song.
 */
class SongFiles {
  /**
   * @param {string} folder - The directory containing the song files.
   * @param {module:baldr-songbook-updater~FileMonitor} fileMonitor - A instance of the FileMonitor() class.
   */
  constructor (folder, fileMonitor) {
    /**
     * A instance of the FileMonitor class.
     * @type {module:baldr-songbook-updater~FileMonitor}
     */
    this.fileMonitor = fileMonitor

    /**
     * The directory containing the song files.
     * @type string
     */
    this.folder = folder

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
    status.info = folderTree.getSongInfo(this.folder)

    status.force = force
    status.changed.slides = this.fileMonitor.isModified(
      path.join(this.folder, 'projector.mscx')
    )
    // projector
    if (config.force || status.changed.slides) {
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
    if (config.force || status.changed.piano) {
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

/**
 * Metadata of a song catched from the info.yml file:
 *
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
 */
class SongMetaData {
  /**
   * @param {string} folder - Absolute path to a song folder.
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
   */
  constructor (songPath) {
    /**
     * The directory containing the song files.
     * @type {string}
     */
    this.folder = this.normalizeSongFolder_(songPath)

    /**
     * The character of the alphabetical folder. The song folders must
     * be placed in alphabetical folders.
     * @type {string}
     */
    this.abc = this.recognizeABCFolder_(this.folder)

    /**
     * The songID is the name of the directory which contains all song files
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
     * An instance of SongFiles.
     * @type {module:baldr-songbook-updater~SongFiles}
     */
    this.files = new SongFiles(this.folder)
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
     * The collection of songs
     * @type {object}
     */
    this.songs = {}
    for (let songPath of this.detectSongs_()) {
      let song = new Song(path.join(this.basePath, songPath))
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
  static flattenTree_ (tree) {
    var newTree = {}
    Object.keys(tree).forEach((abc, index) => {
      Object.keys(tree[abc]).forEach((folder, index) => {
        newTree[folder] = tree[abc][folder]
      })
    })
    return newTree
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
   *
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
   * Calls the method generateIntermediateFiles on each song
   *
   * @param {boolean} force - Force the regeneration of intermediate files.
   */
  generateIntermediateFiles (force = false) {
    for (let songID in this.songs) {
      this.songs[songID].files.generateIntermediateFiles(force)
    }
  }
}

let main = function () {
  let options = setOptions(process.argv)

  if (options.folder) {
    options.force = true
  }

  let config = {
    folder: options.folder,
    force: options.force
  }

  bootstrapConfig(config)

  if (options.path && options.path.length > 0) {
    config.path = options.path
  }

  let fileMonitor = new FileMonitor(path.join(config.path, 'filehashes.db'))

  if (options.clean) {
    clean()
  } else if (options.folder) {
    updateSongFolder(options.folder, fileMonitor)
  } else if (options.json) {
    generateJSON(config.path)
  } else if (options.tex) {
    generateTeX(config.path)
  } else {
    update(config.path, fileMonitor)
  }
}

if (require.main === module) {
  main()
}

exports.Song = Song
exports.SongMetaData = SongMetaData
exports.SongMetaDataCombined = SongMetaDataCombined
exports.Library = Library
exports.Folder = Folder
