/**
 * Classes which represent a song.
 *
 * @module @bldr/songbook-intermediate-files/song
 */

// Node packages.
import * as path from 'path'
import * as childProcess from 'child_process'

// Third party packages.
import * as fs from 'fs-extra'

// Project packages.
import {
  SongMetaDataCombined,
  Song,
  SongMetaData,
  songConstants
} from '@bldr/songbook-core'
import * as log from '@bldr/log'
import { formatMultiPartAssetFileName, genUuid } from '@bldr/core-browser'
import { writeYamlFile, readYamlFile } from '@bldr/file-reader-writer'
import { convertFromYamlRaw } from '@bldr/yaml'

import { listFiles, deleteFiles } from './utils'
import { PianoScore, GenerationMode } from './main'
import { fileMonitor } from './file-monitor'

const constants = songConstants

/**
 * A wrapper class for a folder. If the folder does not exist, it will be
 * created during instantiation.
 */
class Folder {
  /**
   * The path of the folder.
   */
  folderPath: string
  /**
   * @param folderPath - The path segments of the folder.
   */
  constructor (...folderPath: string[]) {
    this.folderPath = path.join(...arguments)
    if (!fs.existsSync(this.folderPath)) {
      fs.mkdirSync(this.folderPath, { recursive: true })
    }
  }

  /**
   * Return the path of the folder.
   */
  get (): string {
    return this.folderPath
  }

  /**
   * Empty the folder (Delete all it’s files).
   */
  empty (): void {
    fs.removeSync(this.folderPath)
    fs.mkdirSync(this.folderPath)
  }

  /**
   * Remove the folder.
   */
  remove (): void {
    fs.removeSync(this.folderPath)
  }
}

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
class ExtendedSongMetaData implements SongMetaData {
  alias?: string
  arranger?: string
  artist?: string
  audio?: string
  composer?: string
  country?: string
  description?: string
  genre?: string
  lyricist?: string
  musescore?: string
  source?: string
  subtitle?: string
  title: string
  wikidata?: string
  wikipedia?: string
  year?: string
  youtube?: string

  /**
   * The file name of the YAML file.
   */
  yamlFile: string = 'info.yml'

  /**
   * All in the YAML file “info.yml” allowed properties (keys).
   */
  allowedProperties: string[] = [
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

  /**
   * The path of then parent song folder.
   */
  folder: string

  /**
   * A Javascript object representation of the `info.yml` file.
   */
  readonly rawYaml: SongMetaData

  /**
   * @param folder - Path of the song folder.
   */
  constructor (folder: string) {
    if (!fs.existsSync(folder)) {
      throw new Error(log.format('Song folder doesn’t exist: %s', [folder]))
    }

    this.folder = folder

    const ymlFile = path.join(folder, this.yamlFile)
    if (!fs.existsSync(ymlFile)) {
      throw new Error(log.format('YAML file could not be found: %s', [ymlFile]))
    }

    this.rawYaml = convertFromYamlRaw(
      fs.readFileSync(ymlFile, 'utf8')
    ) as SongMetaData

    for (const key in this.rawYaml) {
      if (!this.allowedProperties.includes(key)) {
        throw new Error(log.format('Unsupported key: %s', [key]))
      }
    }

    this.alias = this.rawYaml.alias
    this.arranger = this.rawYaml.arranger
    this.artist = this.rawYaml.artist
    this.audio = this.rawYaml.audio
    this.composer = this.rawYaml.composer
    this.country = this.rawYaml.country
    this.description = this.rawYaml.description
    this.genre = this.rawYaml.genre
    this.lyricist = this.rawYaml.lyricist
    this.musescore = this.rawYaml.musescore
    this.source = this.rawYaml.source
    this.subtitle = this.rawYaml.subtitle
    this.title = this.rawYaml.title
    this.wikidata = this.rawYaml.wikidata
    this.wikipedia = this.rawYaml.wikipedia
    this.year = this.rawYaml.year
    this.youtube = this.rawYaml.youtube

    if (this.wikidata != null) {
      const wikidataID = parseInt(this.wikidata)
      if (isNaN(wikidataID)) {
        throw new Error(
          log.format(
            'Wikidata entry “%s” of song “%s” must be an number (without Q).',
            [this.title, this.wikidata]
          )
        )
      }
    }
  }

  toJSON (): { [index: string]: string } {
    return Object.assign(this)
  }
}

/**
 * One song
 */
export class ExtendedSong implements Song {
  folder: string
  abc: string
  songId: string
  metaData: ExtendedSongMetaData

  metaDataCombined: SongMetaDataCombined

  folderIntermediateFiles: Folder

  /**
   * Path of the MuseScore file 'projector.mscx', relative to the base folder
   * of the song collection.
   */
  mscxProjector: string

  /**
   * Path of the MuseScore file for the piano parts, can be 'piano.mscx'
   * or 'lead.mscx', relative to the base folder
   * of the song collection.
   */
  mscxPiano: string

  /**
   * An array of piano score pages in the EPS format.
   */
  pianoFiles: string[]

  /**
   * An array of slides file in the SVG format. For example:
   * `[ '01.svg', '02.svg' ]`
   */
  slidesFiles: string[]

  /**
   * @param songPath - The path of the directory containing the song
   * files or a path of a file inside the song folder (not nested in subfolders)
   */
  constructor (songPath: string) {
    this.folder = this.getSongFolder(songPath)
    this.abc = this.recognizeABCFolder(this.folder)
    this.songId = path.basename(this.folder)
    this.metaData = new ExtendedSongMetaData(this.folder)
    this.metaDataCombined = new SongMetaDataCombined(this.metaData)
    this.folderIntermediateFiles = new Folder(
      this.folder,
      constants.intermediateFolder
    )
    this.mscxProjector = this.detectFile('projector.mscx')
    this.mscxPiano = this.detectFile('piano.mscx', 'lead.mscx')
    this.pianoFiles = listFiles(
      this.folderIntermediateFiles.get(),
      constants.pianoRegExp
    )
    this.slidesFiles = listFiles(
      this.folderIntermediateFiles.get(),
      constants.slideRegExp
    )
  }

  /**
   * Get the song folder.
   *
   * @param songPath - The path of the directory containing the song
   *   files or a path of a file inside the song folder (not nested in
   *   subfolders) or a non-existing song path.
   *
   * @return The path of the parent directory of the song.
   */
  private getSongFolder (songPath: string): string {
    try {
      const stat = fs.lstatSync(songPath)
      if (stat.isDirectory()) {
        return songPath
      } else if (stat.isFile()) {
        return path.dirname(songPath)
      }
    } catch (error) {}
    return songPath.replace(`${path.sep}info.yml`, '')
  }

  /**
   * @param folder - The directory containing the song files.
   *
   * @return A single character
   */
  private recognizeABCFolder (folder: string): string {
    const pathSegments = folder.split(path.sep)
    const abc = pathSegments[pathSegments.length - 2]
    return abc
  }

  /**
   * Detect a file inside the song folder. Throw an exception if the
   * file doesn’t exist.
   *
   * @param file - A filename of a file inside the song folder.
   *
   * @return A joined path of the file relative to the song collection
   *   base dir.
   */
  private detectFile (...file: string[]): string {
    let absPath
    for (const argument of arguments) {
      absPath = path.join(this.folder, argument)
      if (fs.existsSync(absPath)) {
        return absPath
      }
    }
    throw new Error(log.format('File doesn’t exist: %s', [absPath]))
  }

  toJSON (): object {
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
 * Extended version of the Song class to build intermediate files.
 */
export class IntermediateSong extends ExtendedSong {
  /**
   * Format one image file of a piano score in the TeX format.
   *
   * @param index - The index number of the array position
   *
   * @return TeX markup for one EPS image file of a piano score.
   */
  private formatPianoTeXEpsFile (index: number): string {
    const subFolder = path.join(
      this.abc,
      this.songId,
      constants.intermediateFolder,
      this.pianoFiles[index]
    )
    return PianoScore.texCmd('image', subFolder)
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
      throw new Error(
        log.format('The song “%s” has no EPS piano score files.', [
          this.metaData.title
        ])
      )
    }
    if (this.pianoFiles.length > 4) {
      throw new Error(
        log.format('The song “%s” has more than 4 EPS piano score files.', [
          this.metaData.title
        ])
      )
    }
    const template = `\n\\tmpmetadata
{%s} % title
{%s} % subtitle
{%s} % composer
{%s} % lyricist
`
    const output = log.format(template, [
      PianoScore.sanitize(this.metaDataCombined.title),
      PianoScore.sanitize(this.metaDataCombined.subtitle),
      PianoScore.sanitize(this.metaDataCombined.composer),
      PianoScore.sanitize(this.metaDataCombined.lyricist)
    ])
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
  private generatePDF (
    source: string,
    destination: string = ''
  ): string | undefined {
    if (destination === '') {
      destination = source
    }
    const pdf = path.join(
      this.folderIntermediateFiles.get(),
      destination + '.pdf'
    )
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
   * @param regExp - A string to filter the list of file names.
   * @param newMultipartFilename - The new base name of the multipart files.
   *
   * @returns An array of the renamed multipart files names.
   */
  private renameMultipartFiles (
    folder: string,
    regExp: RegExp,
    newMultipartFilename: string
  ): string[] {
    const intermediateFiles = listFiles(folder, regExp)
    let no = 1
    for (const oldName of intermediateFiles) {
      const newName = formatMultiPartAssetFileName(newMultipartFilename, no)
      fs.renameSync(path.join(folder, oldName), path.join(folder, newName))
      no++
    }
    return listFiles(folder, regExp)
  }

  public generateMetaDataForMediaServer (): void {
    const yamlFilePath = path.join(
      this.folderIntermediateFiles.get(),
      'Projektor.svg.yml'
    )
    const oldMetaData = readYamlFile(yamlFilePath)
    let uuid: string
    if (oldMetaData?.uuid != null) {
      uuid = oldMetaData.uuid
    } else {
      uuid = genUuid()
    }
    const newMetaData = this.metaDataCombined.toJSON()
    newMetaData.uuid = uuid
    const metaData = Object.assign({ ref: `LD_${this.songId}` }, newMetaData)
    writeYamlFile(
      path.join(this.folderIntermediateFiles.get(), 'Projektor.svg.yml'),
      metaData
    )
  }

  /**
   * Generate SVG files in the slides subfolder.
   */
  private generateSlides (): string[] {
    const subFolder = this.folderIntermediateFiles.get()
    const oldSVGs = listFiles(subFolder, constants.slideRegExp)
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

    const result = this.renameMultipartFiles(
      subFolder,
      constants.slideRegExp,
      constants.firstSlideName
    )

    log.info('  Generate SVG files: %s', [result.toString()])
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
    deleteFiles(subFolder, /\.eps$/i)
    const pianoFile = path.join(subFolder, 'piano.mscx')
    fs.copySync(this.mscxPiano, pianoFile)
    childProcess.spawnSync('mscore-to-vector.sh', ['-e', pianoFile])
    const result = this.renameMultipartFiles(
      subFolder,
      constants.pianoRegExp,
      constants.firstPianoName
    )
    log.info('  Generate EPS files: %s', [result.toString()])
    if (result.length === 0) {
      throw new Error(
        'The EPS files for the piano score couldn’t be generated.'
      )
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
  generateIntermediateFiles (
    mode: GenerationMode = 'all',
    force: boolean = false
  ): void {
    // slides
    if (
      (mode === 'all' || mode === 'slides') &&
      (force ||
        fileMonitor.isModified(this.mscxProjector) ||
        this.slidesFiles.length === 0)
    ) {
      this.generatePDF('projector')
      this.generateSlides()
    }

    log.info('Check if the MuseScore files of the Song “%s” have changed.', [
      log.colorize.green(this.songId)
    ])

    // piano
    if (
      (mode === 'all' || mode === 'piano') &&
      (force ||
        fileMonitor.isModified(this.mscxPiano) ||
        this.pianoFiles.length === 0)
    ) {
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
        log.info(message, [filePath])
        fs.removeSync(filePath)
      }
    }
    removeFile(
      'Remove temporary PDF file “%s”.',
      path.join(this.folder, 'projector.pdf')
    )
    removeFile(
      'Remove old slides folder “%s”.',
      path.join(this.folder, 'slides')
    )
    removeFile('Remove old piano folder “%s”.', path.join(this.folder, 'piano'))
  }
}
