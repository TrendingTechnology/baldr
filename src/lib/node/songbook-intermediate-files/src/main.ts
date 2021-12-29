/**
 * This package bundles all objects functions together, which are used to
 * generate the intermediate files for the songbook. It has to be it’s own
 * package, because the dependency better-sqlite3 must be complied and that
 * causes trouble in the electron app.
 *
 * @module @bldr/songbook-intermediate-files
 */

import * as childProcess from 'child_process'
import * as os from 'os'
import * as path from 'path'

import * as fs from 'fs-extra'
import glob from 'glob'

// Project packages.
import {
  AlphabeticalSongsTree,
  CoreLibrary,
  SongCollection,
  Song
} from '@bldr/songbook-core'
import * as log from '@bldr/log'

import { ExtendedSong, IntermediateSong } from './song'
import { parseSongIDList } from './utils'

log.setLogLevel(3)

/**
 * Generate all intermediate media files or only slide
 * or piano files. Possible values: “all”, “slides” or “piano”.
 */
export type GenerationMode = 'all' | 'slides' | 'piano'

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
        log.format('A song with the same songId already exists: %s', [
          song.songId
        ])
      )
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
        throw new Error(
          log.format('There is no song with song ID “%s”', [songId])
        )
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

  constructor (
    library: IntermediateLibrary,
    groupAlphabetically: boolean = true,
    pageTurnOptimized: boolean = true
  ) {
    /**
     * A temporary file path where the content of the TeX file gets stored.
     */
    this.texFile = new TextFile(
      path.join(
        fs.mkdtempSync(path.join(os.tmpdir(), 'baldr-songbook-')),
        'songbook.tex'
      )
    )

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

  /**
   * Escape `\&`.
   *
   * @param markup A input string
   *
   * @returns A TeX safe string with escaped `\&`.
   */
  static sanitize (markup: string | undefined): string {
    if (markup != null) {
      return markup.replace('&', '\\&')
    }
    return ''
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
  static selectSongs (
    countTree: PianoFilesCountTree,
    songs: IntermediateSong[],
    pageCount: number
  ): IntermediateSong[] {
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
  static buildSongList (
    songs: IntermediateSong[],
    pageTurnOptimized = false
  ): string {
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
      Object.keys(abcTree).forEach(abc => {
        output.push('\n\n' + PianoScore.texCmd('chapter', abc.toUpperCase()))
        output.push(
          PianoScore.buildSongList(
            abcTree[abc] as IntermediateSong[],
            this.pageTurnOptimized
          )
        )
      })
    } else {
      output.push(
        PianoScore.buildSongList(
          songs as IntermediateSong[],
          this.pageTurnOptimized
        )
      )
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
      'lualatex',
      ['--shell-escape', texFile],
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
      [this.texFile.path] // No color: This will break tests.
    )
    this.texFile.append(texMarkup)

    // To avoid temporary TeX files in the working directory of the shell
    // the command is running from.
    const cwd = path.dirname(this.texFile.path)

    // Compile the TeX file
    // Compile twice for the table of contents
    // The page numbers in the toc only matches after three runs.
    for (let index = 0; index < 3; index++) {
      log.info('Compile the TeX file “%s” the %d time.', [
        this.texFile.path,
        index + 1
      ])
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
    const child = childProcess.spawn(openCommand, [pdfFile], {
      detached: true,
      stdio: 'ignore'
    })
    child.unref()
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
      throw new Error(log.format('Invalid piano file count: %s', [count]))
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

  private collectSongs (): SongCollection<IntermediateSong> {
    const songs: SongCollection<IntermediateSong> = {}
    for (const songPath of this.detectSongs()) {
      const song = new IntermediateSong(path.join(this.basePath, songPath))
      if (song.songId in songs) {
        throw new Error(
          log.format(
            'A song with the same songId already exists: %s',
            [song.songId]
          )
        )
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
    files.forEach(filePath => {
      fs.removeSync(path.join(this.basePath, filePath))
    })
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
      log.info('Delete temporary MuseScore file: %s', [tmpMscx])
      fs.unlinkSync(tmpMscx)
    })
    this.deleteFiles(['songs.tex', 'filehashes.db'])
  }

  /**
   * Calls the method generateIntermediateFiles on each song
   *
   * @param mode - Generate all intermediate media files or only slide
   *   and piano files. Possible values: “all”, “slides” or “piano”
   * @param force - Force the regeneration of intermediate files.
   */
  private generateIntermediateFiles (
    mode: GenerationMode = 'all',
    force: boolean = false
  ): void {
    for (const songId in this.songs) {
      const song = this.songs[songId]
      song.generateIntermediateFiles(mode, force)
    }
  }

  private generateMetaDataForMediaServer (): void {
    for (const songId in this.songs) {
      const song = this.songs[songId]
      song.generateMetaDataForMediaServer()
    }
  }

  public generateLibraryJson (): void {
    const jsonPath = path.join(this.basePath, 'songs.json')
    fs.writeFileSync(jsonPath, JSON.stringify(this, null, '  '))
    log.info('Create JSON file: %s', [jsonPath])
  }

  compilePianoScore (
    groupAlphabetically: boolean,
    pageTurnOptimized: boolean
  ): void {
    const pianoScore = new PianoScore(
      this,
      groupAlphabetically,
      pageTurnOptimized
    )
    pianoScore.compile()
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
   * @param mode - Generate all intermediate media files or only slide
   *   and piano files. Possible values: “all”, “slides” or “piano”
   */
  updateSongBySongId (songId: string, mode: GenerationMode = 'all'): void {
    let song
    if ({}.hasOwnProperty.call(this.songs, songId)) {
      song = this.songs[songId]
    } else {
      throw new Error(
        log.format('The song with the song ID “%s” is unkown.', [songId])
      )
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
      throw new Error(
        'The parameter “mode” must be one of this strings: ' +
          '“all”, “slides” or “piano”.'
      )
    }
    this.generateIntermediateFiles(mode, force)
    this.generateMetaDataForMediaServer()
    this.generateLibraryJson()
  }
}
