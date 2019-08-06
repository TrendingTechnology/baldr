/**
 * This package bundles all objects functions together which are used to
 * generate the intermediate files for the songbook. It has to be it’s own
 * package, because the dependency better-sqlite3 must be complied and that
 * causes trouble in the electron app.
 *
 * @module @bldr/songbook-intermediate-files
 */

// Node packages.
const crypto = require('crypto')
const path = require('path')
const childProcess = require('child_process')
const util = require('util')
const os = require('os')

// Third party packages.
const Sqlite3 = require('better-sqlite3')
const fs = require('fs-extra')

// Project packages.
const {
  Folder,
  Library,
  listFiles,
  message,
  Song
} = require('@bldr/songbook-base')
const { AlphabeticalSongsTree } = require('@bldr/songbook-core')
const { utils } = require('@bldr/core')

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
     * @type {module:baldr-songbook~Sqlite3}
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
   * @param {module:baldr-songbook~Library} library - An instance of the class “Library()”
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
     * @type {module:baldr-songbook~Library}
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
    return markup.replace('&', '\\&')
  }

  /**
   * Fill a certain number of pages with piano score files.
   *
   * @param {module:baldr-songbook~PianoFilesCountTree} countTree - Piano scores grouped by page number.
   * @param {module:baldr-songbook~songs} songs - An array of song objects.
   * @param {number} pageCount - Number of pages to group together.
   *
   * @returns {module:baldr-songbook~songs} An array of song objects, which fit in a given page number
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
   * @param {module:baldr-songbook~songs} songs - An array of song objects.
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
   */
  read_ (filename) {
    return fs.readFileSync(path.join(__dirname, filename), { encoding: 'utf8' })
  }

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
    this.texFile.append(texMarkup)
    utils.log('The TeX markup was written to: %s', this.texFile.path)

    // To avoid temporary TeX files in the working directory of the shell
    // the command is running from.
    const cwd = path.dirname(this.texFile.path)

    // Compile the TeX file
    // Compile twice for the table of contents
    // The page numbers in the toc only matches after three runs.
    for (let index = 0; index < 3; index++) {
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
    childProcess.spawnSync(openCommand, [pdfFile])
  }
}

class IntermediateSong extends Song {
  /**
   * @param {string} songPath - The path of the directory containing the song
   * files or a path of a file inside the song folder (not nested in subfolders)
   * @param {string} projectorPath - Directory to store intermediate files for
   *   the projector app (*.svg, *.json).
   * @param {string} pianoPath - Directory to store intermediate files for
   *   the piano score (*.eps).
   * @param {module:baldr-songbook~FileMonitor} fileMonitor - A instance
   * of the FileMonitor() class.
   */
  constructor (songPath, projectorPath, pianoPath, fileMonitor) {
    super(songPath)

    /**
     * Directory to store intermediate files for the projector app
     * (*.svg, *.json).
     *
     * @type {string}
     */
    this.projectorPath = projectorPath
    if (this.projectorPath) {
      this.projectorPath = this.normalizeSongFolder_(this.projectorPath)
      this.folderSlides = new Folder(this.projectorPath)
    }

    /**
     * Directory to store intermediate files for the piano score (*.eps).
     *
     * @type {string}
     */
    this.pianoPath = pianoPath
    if (this.pianoPath) {
      this.pianoPath = this.normalizeSongFolder_(this.pianoPath)
      this.folderPiano = new Folder(this.pianoPath)
    }

    /**
     * A instance of the FileMonitor class.
     *
     * @type {module:baldr-songbook~FileMonitor}
     */
    this.fileMonitor = fileMonitor
  }

  /**
   * Format one image file of a piano score in the TeX format.
   *
   * @param {number} index The index number of the array position
   *
   * @return {string} TeX markup for one EPS image file of a piano score.
   */
  formatPianoTeXEpsFile_ (index) {
    let subFolder
    if (!this.pianoPath) {
      subFolder = path.join(this.abc, this.songID, 'piano', this.pianoFiles[index])
    } else {
      subFolder = path.join(this.abc, this.songID, this.pianoFiles[index])
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
   */
  generatePiano_ () {
    this.folderPiano.empty()
    const dest = this.folderPiano.get()
    const pianoFile = path.join(dest, 'piano.mscx')
    fs.copySync(this.mscxPiano, pianoFile)
    childProcess.spawnSync('mscore-to-eps.sh', [pianoFile])
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
   * @param {module:baldr-songbook~songs} songs - An array of song objects.
   */
  constructor (songs) {
    this.validCounts_ = [1, 2, 3, 4]
    this.build_(songs)
  }

  /**
   * @param {number} count - 1, 2, 3, 4
   */
  checkCount_ (count) {
    if (this.validCounts_.includes(count)) {
      return true
    } else {
      throw new Error(util.format('Invalid piano file count: %s', count))
    }
  }

  /**
   * @param {module:baldr-songbook~songs} songs - An array of song objects.
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
   * @returns {module:baldr-songbook~Song}
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
     * @type {module:baldr-songbook~FileMonitor}
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
      if (song.songID in songs) {
        throw new Error(
          util.format('A song with the same songID already exists: %s',
            song.songID))
      }
      songs[song.songID] = song
    }
    return songs
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
    for (const songID in this.songs) {
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
   * @param {string} mode - Generate all intermediate media files or only slide
   *   and piano files. Possible values: “all”, “slides” or “piano”
   * @param {boolean} force - Force the regeneration of intermediate files.
   */
  generateIntermediateFiles (mode = 'all', force = false) {
    for (const songID in this.songs) {
      const song = this.songs[songID]
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
   * @param {string} songID - The ID of the song (the name of the parent song folder)
   * @param {string} mode - Generate all intermediate media files or only slide
   *   and piano files. Possible values: “all”, “slides” or “piano”
   */
  updateSongBySongId (songID, mode = 'all') {
    let song
    if ({}.hasOwnProperty.call(this.songs, songID)) {
      song = this.songs[songID]
    } else {
      throw new Error(util.format('The song with the song ID “%s” is unkown.', songID))
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

exports.checkExecutables = checkExecutables
exports.IntermediateLibrary = IntermediateLibrary
exports.PianoScore = PianoScore
