/**
 * This package bundles all objects functions together, which are used to
 * generate the intermediate files for the songbook. It has to be it’s own
 * package, because the dependency better-sqlite3 must be complied and that
 * causes trouble in the electron app.
 *
 * @module @bldr/songbook-intermediate-files
 */

// Node packages.
import * as childProcess from 'child_process'
import * as os from 'os'
import * as path from 'path'

// Third party packages.
import * as fs from 'fs-extra'
import glob from 'glob'
import yaml from 'js-yaml'

// Project packages.
import {
  AlphabeticalSongsTree,
  CoreLibrary,
  SongCollection,
  Song
} from '@bldr/songbook-core'
import * as log from '@bldr/log'
import { StringIndexedObject } from '@bldr/type-definitions'
import { formatMultiPartAssetFileName, jsYamlConfig } from '@bldr/core-browser'

import { ExtendedSong } from './song'
import { parseSongIDList, listFiles, deleteFiles } from './utils'

/**
 * See `/etc/baldr.json`.
 */
import config from '@bldr/config'
import { fileMonitor } from './file-monitor'

log.setLogLevel(3)

/**
 * Generate all intermediate media files or only slide
 * or piano files. Possible values: “all”, “slides” or “piano”.
 */
type GenerationMode = 'all' | 'slides' | 'piano'

/*******************************************************************************
 * Classes for multiple songs
 ******************************************************************************/

/**
 * Collect all songs of a song tree by walking through the folder tree
 * structur.
 *
 * @returns An object indexed with the song ID containing the song
 * objects.
 */
function collectSongs (basePath: string): SongCollection<ExtendedSong> {
  const songsPaths = glob.sync('info.yml', { cwd: basePath, matchBase: true })
  const songs: SongCollection<ExtendedSong> = {}
  for (const songPath of songsPaths) {
    const song = new ExtendedSong(path.join(basePath, songPath))
    if (song.songId in songs) {
      throw new Error(
        log.format('A song with the same songId already exists: %s',
          song.songId))
    }
    songs[song.songId] = song
  }
  return songs
}

/**
 * The song library - a collection of songs
 */
class Library extends CoreLibrary {
  /**
   * The base path of the song library
   */
  basePath: string

  /**
   * @param basePath - The base path of the song library
   */
  constructor (basePath: string) {
    super(collectSongs(basePath) as SongCollection<Song>)
    this.basePath = basePath
  }

  /**
   * Identify a song folder by searching for a file named “info.yml.”
   */
  protected detectSongs (): string[] {
    return glob.sync('info.yml', { cwd: this.basePath, matchBase: true })
  }

  /**
   * @param listFile
   *
   * @returns {object}
   */
  loadSongList (listFile: string): SongCollection<Song> {
    const songIds = parseSongIDList(listFile)
    const songs: SongCollection<Song> = {}
    for (const songId of songIds) {
      if ({}.hasOwnProperty.call(this.songs, songId)) {
        songs[songId] = this.songs[songId]
      } else {
        throw new Error(log.format('There is no song with song ID “%s”', songId))
      }
    }
    this.songs = songs
    return songs
  }
}

/**
 * A text file.
 */
class TextFile {
  /**
   * The path of the text file.
   */
  path: string

  /**
   * @param path The path of the text file.
   */
  constructor (path: string) {
    this.path = path
    this.flush()
  }

  /**
   * Append content to the text file.
   *
   * @param content - Content to append to the text file.
   */
  append (content: string): void {
    fs.appendFileSync(this.path, content)
  }

  /**
   * Read the whole text file.
   */
  read (): string {
    return fs.readFileSync(this.path, { encoding: 'utf8' })
  }

  /**
   * Delete the content of the text file, not the text file itself.
   */
  flush (): void {
    fs.writeFileSync(this.path, '')
  }

  /**
   * Remove the text file.
   */
  remove (): void {
    fs.unlinkSync(this.path)
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
export class PianoScore {
  /**
   * A temporary file path where the content of the TeX file gets stored.
   */
  texFile: TextFile
  library: IntermediateLibrary
  groupAlphabetically: boolean
  pageTurnOptimized: boolean

  constructor (library: IntermediateLibrary, groupAlphabetically: boolean = true, pageTurnOptimized: boolean = true) {
    /**
     * A temporary file path where the content of the TeX file gets stored.
     */
    this.texFile = new TextFile(path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'baldr-songbook-')), 'songbook.tex'))

    this.library = library

    this.groupAlphabetically = groupAlphabetically
    this.pageTurnOptimized = pageTurnOptimized
  }

  /**
   * Generate TeX markup. Generate a TeX command prefixed with \tmp.
   *
   * @param command
   * @param value
   *
   * @return A TeX markup, for example: \tmpcommand{value}\n
   */
  static texCmd (command: string, value?: string): string {
    let markupValue
    if (value != null) {
      markupValue = `{${value}}`
    } else {
      markupValue = ''
    }
    return `\\tmp${command}${markupValue}\n`
  }

  static sanitize (markup: string): string {
    return markup.replace('&', '\\&')
  }

  /**
   * Fill a certain number of pages with piano score files.
   *
   * @param countTree - Piano scores grouped by page number.
   * @param songs - An array of song objects.
   * @param pageCount - Number of pages to group together.
   *
   * @returns An array of song objects, which fit in a given page number
   */
  static selectSongs (countTree: PianoFilesCountTree, songs: IntermediateSong[], pageCount: number): IntermediateSong[] {
    for (let i = pageCount; i > 0; i--) {
      if (!countTree.isEmpty()) {
        const song = countTree.shift(i)
        if (song != null) {
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
   * @param songs - An array of song objects.
   *
   * @return {string}
   */
  static buildSongList (songs: IntermediateSong[], pageTurnOptimized = false): string {
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
          if (countPlaceholders > 0) {
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
  build (): string {
    const output = []
    const songs = this.library.toArray()
    if (this.groupAlphabetically) {
      const abcTree = new AlphabeticalSongsTree(songs)
      Object.keys(abcTree).forEach((abc) => {
        output.push('\n\n' + PianoScore.texCmd('chapter', abc.toUpperCase()))
        output.push(PianoScore.buildSongList(abcTree[abc] as IntermediateSong[], this.pageTurnOptimized))
      })
    } else {
      output.push(PianoScore.buildSongList(songs as IntermediateSong[], this.pageTurnOptimized))
    }
    return output.join('')
  }

  /**
   * Read the content of a text file.
   *
   * @param The name of the text (TeX) file inside this package
   */
  private read (filename: string): string {
    return fs.readFileSync(path.join(__dirname, filename), { encoding: 'utf8' })
  }

  private spawnTex (texFile: string, cwd: string): void {
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
  compile (): void {
    // Assemble the Tex markup.
    const style = this.read('style.tex')
    const mainTexMarkup = this.read('piano-all.tex')
    const songs = this.build()
    let texMarkup = mainTexMarkup.replace('//style//', style)
    texMarkup = texMarkup.replace('//songs//', songs)
    texMarkup = texMarkup.replace('//created//', new Date().toLocaleString())
    texMarkup = texMarkup.replace('//basepath//', this.library.basePath)

    // Write contents to the text file.
    log.info(
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
      log.info(
        'Compile the TeX file “%s” the %d time.',
        this.texFile.path,
        index + 1
      )
      this.spawnTex(this.texFile.path, cwd)
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
class IntermediateSong extends ExtendedSong {
  /**
   * Format one image file of a piano score in the TeX format.
   *
   * @param index - The index number of the array position
   *
   * @return TeX markup for one EPS image file of a piano score.
   */
  private formatPianoTeXEpsFile (index: number): string {
    const subFolder = path.join(this.abc, this.songId, 'piano', this.pianoFiles[index])
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
  formatPianoTex (): string {
    if (this.pianoFiles.length === 0) {
      throw new Error(log.format(
        'The song “%s” has no EPS piano score files.',
        this.metaData.title))
    }
    if (this.pianoFiles.length > 4) {
      throw new Error(log.format(
        'The song “%s” has more than 4 EPS piano score files.',
        this.metaData.title))
    }
    const template = `\n\\tmpmetadata
{%s} % title
{%s} % subtitle
{%s} % composer
{%s} % lyricist
`
    const output = log.format(
      template,
      PianoScore.sanitize(this.metaDataCombined.title),
      PianoScore.sanitize(this.metaDataCombined.subtitle),
      PianoScore.sanitize(this.metaDataCombined.composer),
      PianoScore.sanitize(this.metaDataCombined.lyricist)
    )
    const epsFiles = []
    for (let i = 0; i < this.pianoFiles.length; i++) {
      epsFiles.push(this.formatPianoTeXEpsFile(i))
    }
    return output + epsFiles.join('\\tmpcolumnbreak\n')
  }

  /**
   * Generate form a given *.mscx file a PDF file.
   *
   * @param source - Name of the *.mscx file without the extension.
   * @param destination - Name of the PDF without the extension.
   */
  private generatePDF (source: string, destination: string = ''): string | undefined {
    if (destination === '') {
      destination = source
    }
    const pdf = path.join(this.folderIntermediateFiles.get(), destination + '.pdf')
    childProcess.spawnSync('mscore', [
      '--export-to',
      path.join(pdf),
      path.join(this.folder, source + '.mscx')
    ])
    if (fs.existsSync(pdf)) {
      return destination + '.pdf'
    }
  }

  /**
   * Rename an array of multipart media files to follow the naming scheme `_noXXX.extension`.
   *
   * @param folder - The folder containing the files to be renamed.
   * @param filter - A string to filter the list of file names.
   * @param newMultipartFilename - The new base name of the multipart files.
   *
   * @returns An array of the renamed multipart files names.
   */
  private renameMultipartFiles (folder: string, filter: string, newMultipartFilename: string): string[] {
    const intermediateFiles = listFiles(folder, filter)
    let no = 1
    for (const oldName of intermediateFiles) {
      const newName = formatMultiPartAssetFileName(newMultipartFilename, no)
      fs.renameSync(path.join(folder, oldName), path.join(folder, newName))
      no++
    }
    return listFiles(folder, filter)
  }

  /**
   * Generate SVG files in the slides subfolder.
   */
  private generateSlides (): string[] {
    const subFolder = this.folderIntermediateFiles.get()
    const oldSVGs = listFiles(subFolder, '.svg')
    for (const oldSVG of oldSVGs) {
      fs.unlinkSync(path.join(subFolder, oldSVG))
    }
    const src = path.join(subFolder, 'projector.pdf')
    childProcess.spawnSync('pdf2svg', [
      src,
      path.join(subFolder, '%02d.svg'),
      'all'
    ])
    fs.unlinkSync(src)

    const result = this.renameMultipartFiles(subFolder, '.svg', 'Projektor.svg')
    log.info('Generate SVG files: %s', result)
    if (result.length === 0) {
      throw new Error('The SVG files for the slides couldn’t be generated.')
    }
    this.slidesFiles = result
    return result
  }

  /**
   * Generate EPS files for the piano score from the MuseScore file
   * “piano/piano.mscx” .
   *
   * @return An array of EPS piano score filenames.
   */
  private generatePiano (): string[] {
    const subFolder = this.folderIntermediateFiles.get()
    deleteFiles(subFolder, '.eps')
    const pianoFile = path.join(subFolder, 'piano.mscx')
    fs.copySync(this.mscxPiano, pianoFile)
    childProcess.spawnSync('mscore-to-vector.sh', ['-e', pianoFile])
    const result = this.renameMultipartFiles(subFolder, '.eps', 'Piano.eps')
    log.info('Generate EPS files: %s', result)
    if (result.length === 0) {
      throw new Error('The EPS files for the piano score couldn’t be generated.')
    }
    this.pianoFiles = result
    return result
  }

  /**
   * Wrapper method for all process methods of one song folder.
   *
   * @param mode - Generate all intermediate media files or only slide
   *   and piano files. Possible values: “all”, “slides” or “piano”
   * @param force - Force the regeneration of intermediate files.
   */
  generateIntermediateFiles (mode: GenerationMode = 'all', force: boolean = false): void {
    // slides
    if ((mode === 'all' || mode === 'slides') &&
        (force || fileMonitor.isModified(this.mscxProjector) || (this.slidesFiles.length === 0))) {
      this.generatePDF('projector')
    }

    log.info('Generate intermediate files for the Song “%s”.', this.songId)

    // piano
    if ((mode === 'all' || mode === 'piano') &&
        (force || fileMonitor.isModified(this.mscxPiano) || (this.pianoFiles.length === 0))) {
      this.generatePiano()
    }
  }

  /**
   * Delete all generated intermediate files of a song folder.
   */
  cleanIntermediateFiles (): void {
    this.folderIntermediateFiles.remove()

    function removeFile (message: string, filePath: string): void {
      if (fs.existsSync(filePath)) {
        log.info(message, filePath)
        fs.removeSync(filePath)
      }
    }
    removeFile('Remove temporary PDF file “%s”.', path.join(this.folder, 'projector.pdf'))
    removeFile('Remove old slides folder “%s”.', path.join(this.folder, 'slides'))
    removeFile('Remove old piano folder “%s”.', path.join(this.folder, 'piano'))
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
  private readonly validCounts: number[]
  private cache: { [key: number]: IntermediateSong[] }
  /**
   * @param songs - An array of song objects.
   */
  constructor (songs: IntermediateSong[]) {
    this.validCounts = [1, 2, 3, 4]
    this.cache = {
      1: [],
      2: [],
      3: [],
      4: []
    }
    this.build(songs)
  }

  /**
   * @param count - 1, 2, 3, 4
   */
  private checkCount (count: number): boolean | undefined {
    if (this.validCounts.includes(count)) {
      return true
    } else {
      throw new Error(log.format('Invalid piano file count: %s', count))
    }
  }

  /**
   * @param songs - An array of song objects.
   */
  private build (songs: IntermediateSong[]): void {
    for (const song of songs) {
      const count = song.pianoFiles.length
      if (!(count in this)) this.cache[count] = []
      this.cache[count].push(song)
    }
  }

  /**
   * Sum up the number of all songs in all count categories.
   */
  sum (): number {
    let count = 0
    for (const validCount of this.validCounts) {
      if ({}.hasOwnProperty.call(this, validCount)) {
        count = count + this.cache[validCount].length
      }
    }
    return count
  }

  /**
   * Sum up the number of files of all songs in all count categories.
   */
  sumFiles (): number {
    let count = 0
    for (const validCount of this.validCounts) {
      if ({}.hasOwnProperty.call(this.cache, validCount)) {
        count += validCount * this.cache[validCount].length
      }
    }
    return count
  }

  /**
   * Return true if the count tree has no songs.
   *
   * @return {boolean}
   */
  isEmpty (): boolean {
    if (this.sum() === 0) {
      return true
    } else {
      return false
    }
  }

  /**
   * Shift the array of songs that has ”count” number of piano files.
   *
   * @param count - 1, 2, 3, 4
   *
   * @returns Song
   */
  shift (count: number): IntermediateSong | undefined {
    this.checkCount(count)
    if ({}.hasOwnProperty.call(this, count)) return this.cache[count].shift()
  }
}

export class IntermediateLibrary extends Library {
  songs: SongCollection<IntermediateSong> = this.collectSongs()

  /**
   * @param basePath - The base path of the song library
   */
  constructor (basePath: string) {
    super(basePath)
    this.songs = this.collectSongs()
  }

  /**
   * Execute git pull if repository exists.
   */
  gitPull (): childProcess.SpawnSyncReturns<Buffer> | undefined {
    if (fs.existsSync(path.join(this.basePath, '.git'))) {
      return childProcess.spawnSync('git', ['pull'], { cwd: this.basePath })
    }
  }

  private collectSongs (): SongCollection<IntermediateSong> {
    const songs: SongCollection<IntermediateSong> = {}
    for (const songPath of this.detectSongs()) {
      const song = new IntermediateSong(
        path.join(this.basePath, songPath))
      if (song.songId in songs) {
        throw new Error(
          log.format('A song with the same songId already exists: %s',
            song.songId))
      }
      songs[song.songId] = song
    }
    return songs
  }

  /**
   * Delete multiple files.
   *
   * @param files - An array of files to delete.
   */
  private deleteFiles (files: string[]): void {
    files.forEach(
      (filePath) => {
        fs.removeSync(path.join(this.basePath, filePath))
      }
    )
  }

  /**
   * Clean all intermediate media files.
   */
  cleanIntermediateFiles (): void {
    for (const songId in this.songs) {
      this.songs[songId].cleanIntermediateFiles()
    }

    glob.sync('**/.*.mscx,', { cwd: this.basePath }).forEach(relativePath => {
      const tmpMscx = path.join(this.basePath, relativePath)
      log.info('Delete temporary MuseScore file: %s', tmpMscx)
      fs.unlinkSync(tmpMscx)
    })
    this.deleteFiles([
      'songs.tex',
      'filehashes.db'
    ])
  }

  /**
   * Calls the method generateIntermediateFiles on each song
   *
   * @param mode - Generate all intermediate media files or only slide
   *   and piano files. Possible values: “all”, “slides” or “piano”
   * @param force - Force the regeneration of intermediate files.
   */
  generateIntermediateFiles (mode: GenerationMode = 'all', force: boolean = false): void {
    for (const songId in this.songs) {
      const song = this.songs[songId]
      song.generateIntermediateFiles(mode, force)
    }
  }

  /**
   * Generate all intermediate media files for one song.
   *
   * @param folder - The path of the parent song folder.
   * @param mode - Generate all intermediate media files or only slide
   *   and piano files. Possible values: “all”, “slides” or “piano”
   */
  updateSongByPath (folder: string, mode: GenerationMode = 'all'): void {
    // To throw an error if the folder doesn’t exist.
    fs.lstatSync(folder)
    const song = new IntermediateSong(folder)
    song.generateIntermediateFiles(mode, true)
  }

  /**
   * Generate all intermediate media files for one song.
   *
   * @param songId - The ID of the song (the name of the parent song folder)
   * @param {string} mode - Generate all intermediate media files or only slide
   *   and piano files. Possible values: “all”, “slides” or “piano”
   */
  updateSongBySongId (songId: string, mode: GenerationMode = 'all'): void {
    let song
    if ({}.hasOwnProperty.call(this.songs, songId)) {
      song = this.songs[songId]
    } else {
      throw new Error(log.format('The song with the song ID “%s” is unkown.', songId))
    }
    song.generateIntermediateFiles(mode, true)
  }

  /**
   * Update the whole song library.
   *
   * @param mode - Generate all intermediate media files or only slide
   *   and piano files. Possible values: “all”, “slides” or “piano”
   * @param force - Force the regeneration of intermediate files.
   */
  update (mode: GenerationMode = 'all', force: boolean = false): void {
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
export function exportToMediaServer (library: IntermediateLibrary): void {
  // NB = Notenbeispiele -> SVG
  // /var/data/baldr/media/Lieder/NB
  // There exists a folder for the audio files: HB (Hörbeispiele)
  const dirBase = path.join(config.mediaServer.basePath, 'Lieder', 'NB')
  try {
    fs.rmdirSync(dirBase)
  } catch (error) {}
  fs.ensureDirSync(dirBase)

  function exportSong (song: IntermediateSong): void {
    // /var/data/baldr/media/Lieder/NB/a
    const dirAbc = path.join(dirBase, song.abc)
    fs.ensureDirSync(dirAbc)

    const firstFileName = path.join(dirAbc, `${song.songId}.svg`)

    // song.slidesFiles: ['01.svg', '02.svg']
    for (let index = 0; index < song.slidesFiles.length; index++) {
      const src = path.join(song.folderIntermediateFiles.get(), song.slidesFiles[index])
      const dest = formatMultiPartAssetFileName(firstFileName, index + 1)
      fs.copySync(src, dest)
      log.info('Copy %s to %s.', src, dest)
    }

    const rawYaml: StringIndexedObject = song.metaData.rawYaml as StringIndexedObject
    rawYaml.id = `Lied_${song.songId}_NB`
    rawYaml.title = `Lied „${song.metaData.title}“`

    // for (const property of song.metaDataCombined.allProperties) {
    //   if (song.metaDataCombined[property]) {
    //     rawYaml[`${convertCamelToSnake(property)}_combined`] = song.metaDataCombined[property]
    //   }
    // }

    const yamlMarkup = ['---', yaml.dump(rawYaml, jsYamlConfig)]
    fs.writeFileSync(`${firstFileName}.yml`, yamlMarkup.join('\n'))
  }

  for (const song of library.toArray()) {
    exportSong(song as IntermediateSong)
  }
}

/**
 * Build the Vue app. All image files must be copied into the Vue working
 * directory.
 */
export function buildVueApp (): void {
  const process = childProcess.spawnSync('npm', ['run', 'build'], {
    cwd: config.songbook.vueAppPath,
    encoding: 'utf-8',
    shell: true
  })
  log.info(process.stdout)
  log.error(process.stderr)
}
