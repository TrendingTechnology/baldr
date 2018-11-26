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
const os = require('os')
const path = require('path')
const pckg = require('./package.json')
const spawn = require('child_process').spawnSync
const Sqlite3 = require('better-sqlite3')
const util = require('util')
const yaml = require('js-yaml')

const json = require('./json.js')
const folderTree = require('./tree.js')

// For test purposes, to be able to overwrite “message” with rewire.
let message = require('./message.js')

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
 * Build a TeX file (songs.tex) of all piano scores.
 **********************************************************************/

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

class Song {
  constructor (folder) {
    this.folder = folder
  }
}

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
    let slides = path.join(this.folder, 'slides')
    fs.removeSync(slides)
    fs.mkdirSync(slides)

    spawn('pdf2svg', [
      path.join(this.folder, 'projector.pdf'),
      path.join(slides, '%02d.svg'),
      'all'
    ])

    return this.getFolderFiles_('slides', '.svg')
  }

  /**
   * Generate a PDF named piano.pdf a) from piano.mscx or b) from lead.mscx
   * @param {string} folder - A song folder.
   */
  generatePiano_ () {
    let pianoFolder = path.join(this.folder, 'piano')
    fs.removeSync(pianoFolder)
    fs.mkdirSync(pianoFolder)
    let pianoFile = path.join(pianoFolder, 'piano.mscx')
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

class Sqlite {
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

  insert (filename, hash) {
    this.db
      .prepare('INSERT INTO hashes values ($filename, $hash)')
      .run({ 'filename': filename, 'hash': hash })
  }

  select (filename) {
    return this.db
      .prepare('SELECT * FROM hashes WHERE filename = $filename')
      .get({ 'filename': filename })
  }

  update (filename, hash) {
    this.db
      .prepare('UPDATE hashes SET hash = $hash WHERE filename = $filename')
      .run({ 'filename': filename, 'hash': hash })
  }

  flush () {
    this.db.prepare('DELETE FROM hashes').run()
  }
}

/**
 * Monitor files changes
 */
class FileMonitor {
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
   * @param {string} filename - Path to the file.
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
