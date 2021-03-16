/**
 * Classes which represent a song.
 *
 * @module @bldr/songbook-intermediate-files/song
 */

// Node packages.
import * as path from 'path'

// Third party packages.
import * as fs from 'fs-extra'
import yaml from 'js-yaml'

// Project packages.
import {
  SongMetaDataCombined,
  Song,
  SongMetaData
} from '@bldr/songbook-core'
import * as log from '@bldr/log'

import { listFiles } from './utils'

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
      throw new Error(log.format('Song folder doesn’t exist: %s', folder))
    }

    this.folder = folder

    const ymlFile = path.join(folder, this.yamlFile)
    if (!fs.existsSync(ymlFile)) {
      throw new Error(log.format('YAML file could not be found: %s', ymlFile))
    }

    this.rawYaml = yaml.load(fs.readFileSync(ymlFile, 'utf8')) as SongMetaData

    for (const key in this.rawYaml) {
      if (!this.allowedProperties.includes(key)) {
        throw new Error(log.format('Unsupported key: %s', key))
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
            this.title,
            this.wikidata
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
    this.folderIntermediateFiles = new Folder(this.folder, 'NB')
    this.mscxProjector = this.detectFile('projector.mscx')
    this.mscxPiano = this.detectFile('piano.mscx', 'lead.mscx')
    this.pianoFiles = listFiles(this.folderIntermediateFiles.get(), '.eps')
    this.slidesFiles = listFiles(this.folderIntermediateFiles.get(), '.svg')
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
    throw new Error(log.format('File doesn’t exist: %s', absPath))
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
