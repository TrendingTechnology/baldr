/**
 * This package bundles all objects functions together which are used to
 * generate the intermediate files for the songbook. It has to be it’s own
 * package, because the dependency better-sqlite3 must be complied and that
 * causes trouble in the electron app.
 *
 * @module @bldr/songbook-intermediate-files
 */

const { Song, Library, message, AlphabeticalSongsTree } = require('@bldr/songbook-base')
const crypto = require('crypto')
const fs = require('fs-extra')
const path = require('path')
const spawn = require('child_process').spawnSync
const Sqlite3 = require('better-sqlite3')
const util = require('util')
const os = require('os')

/**
 * Check if executable is installed.
 *
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
 *
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
   * @param {string} texFile - The path of the TeX file.
   * @param {module:baldr-songbook~Library} library - An instance of the class “Library()”
   * @param {boolean} groupAlphabetically
   * @param {boolean} pageTurnOptimized
   */
  constructor (texFile, library, groupAlphabetically = true, pageTurnOptimized = true) {
    this.tmpTexFile = path.join(fs.mkdtempSync('songbook'), 'songbook.tex')
    this.texFile = new TextFile(texFile)
    this.library = library
    this.groupAlphabetically = groupAlphabetically
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
        let song = countTree.shift(i)
        if (song) {
          let missingPages = pageCount - i
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
    let doublePages = []
    if (pageTurnOptimized) {
      let firstPage = true
      let countTree = new PianoFilesCountTree(songs)
      while (!countTree.isEmpty()) {
        // One page with two columns or two pages with 4 columns
        let doublePage = []
        let maxPages = 4
        let actualPages = 0
        if (firstPage) {
          maxPages = 2
          firstPage = false
        }
        let songs = PianoScore.selectSongs(countTree, [], maxPages)
        for (let song of songs) {
          actualPages = actualPages + song.pianoFiles.length
          doublePage.push(song.formatPianoTex())
        }
        // Do not add placeholder on the end of list.
        if (countTree.sumFiles() > maxPages) {
          // Add placeholder for blank pages
          let placeholder = PianoScore.texCmd('placeholder')
          let countPlaceholders = maxPages - actualPages
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
      for (let song of songs) {
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
    let output = []
    let songs = this.library.toArray()
    if (this.groupAlphabetically) {
      let abcTree = new AlphabeticalSongsTree(songs)
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

  /**
   * Build and write the TeX file.
   */
  write () {
    this.texFile.append(this.build())
  }

  /**
   * Compile the TeX file using lualatex and open the compiled pdf.
   */
  compile () {
    // Assemble the Tex markup.
    let style = this.read_('style.tex')
    let mainTexMarkup = this.read_('piano-all.tex')
    let songs = this.build()
    mainTexMarkup.replace('//style//', style)
    mainTexMarkup.replace('//songs//', songs)
    mainTexMarkup.replace('//basepath//', this.library.basePath)

    // Write contents to the text file.
    let textFile = new TextFile(this.tmpTexFile)
    textFile.append(mainTexMarkup)

    // Compile the TeX file
    spawn('lualatex', [this.tmpTexFile])

    // Open the pdf file.
    let tmpPdfFile = this.tmpTexFile.replace('.tex', '.pdf')
    let openCommand
    if (os.platform() === 'darwin') {
      openCommand = 'open'
    } else {
      openCommand = 'xdg-open'
    }
    spawn(openCommand, [tmpPdfFile])
  }
}

class IntermediateSong extends Song {
  /**
   * @param {string} songPath - The path of the directory containing the song
   * files or a path of a file inside the song folder (not nested in subfolders)
   * @param {module:baldr-songbook~FileMonitor} fileMonitor - A instance
   * of the FileMonitor() class.
   */
  constructor (songPath, fileMonitor) {
    super(songPath)

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
    return PianoScore.texCmd('image',
      path.join(this.abc, this.songID, 'piano', this.pianoFiles[index]))
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
    let template = `\n\\tmpmetadata
{%s} % title
{%s} % subtitle
{%s} % composer
{%s} % lyricist
`
    let output = util.format(
      template,
      this.metaDataCombined.title,
      this.metaDataCombined.subtitle,
      this.metaDataCombined.composer,
      this.metaDataCombined.lyricist
    )
    let epsFiles = []
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
   *
   * @param {string} folder - A song folder.
   */
  generateSlides_ () {
    this.folderSlides.empty()
    spawn('pdf2svg', [
      path.join(this.folder, 'projector.pdf'),
      path.join(this.folderSlides.get(), '%02d.svg'),
      'all'
    ])
    let result = this.getFolderFiles_('slides', '.svg')
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
    let pianoFile = path.join(this.folderPiano.get(), 'piano.mscx')
    fs.copySync(this.mscxPiano, pianoFile)
    spawn('mscore-to-eps.sh', [pianoFile])
    let result = this.getFolderFiles_('piano', '.eps')
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
    let status = { changed: {}, generated: {} }

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
    for (let song of songs) {
      let count = song.pianoFiles.length
      if (!(count in this)) this[count] = []
      this[count].push(song)
    }
  }

  /**
   * Sum up the number of all songs in all count categories.
   */
  sum () {
    let count = 0
    for (let validCount of this.validCounts_) {
      if (this.hasOwnProperty(validCount)) {
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
    for (let validCount of this.validCounts_) {
      if (this.hasOwnProperty(validCount)) {
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
    if (this.hasOwnProperty(count)) return this[count].shift()
  }
}

class IntermediateLibrary extends Library {
  /**
   * @param {string} - The base path of the song library
   */
  constructor (basePath) {
    super(basePath)
    /**
     * A instance of the FileMonitor class.
     *
     * @type {module:baldr-songbook~FileMonitor}
     */
    this.fileMonitor = new FileMonitor(path.join(this.basePath,
      'filehashes.db'))

    this.songs = this.collectSongs_()
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

  collectSongs_ () {
    let songs = {}
    for (let songPath of this.detectSongs_()) {
      let song = new IntermediateSong(path.join(this.basePath, songPath), this.fileMonitor)
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
   * @param {string} mode - Generate all intermediate media files or only slide
   *   and piano files. Possible values: “all”, “slides” or “piano”
   * @param {boolean} force - Force the regeneration of intermediate files.
   */
  generateIntermediateFiles (mode = 'all', force = false) {
    for (let songID in this.songs) {
      let song = this.songs[songID]
      let status = song.generateIntermediateFiles(mode, force)
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
    let song = new IntermediateSong(folder, this.fileMonitor)
    let status = song.generateIntermediateFiles(mode, true)
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
    if (this.songs.hasOwnProperty(songID)) {
      song = this.songs[songID]
    } else {
      throw new Error(util.format('The song with the song ID “%s” is unkown.', songID))
    }
    let status = song.generateIntermediateFiles(mode, true)
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
