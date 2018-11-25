#! /usr/bin/env node

/**
 * @file Assemble all submodules and export to command.js
 */

'use strict'

const fs = require('fs-extra')
const os = require('os')
const path = require('path')
const commander = require('commander')
const pckg = require('./package.json')
const yaml = require('js-yaml')
const util = require('util')

const Check = require('./check.js')
var CheckChange = new Check()
const json = require('./json.js')
const mscx = require('./mscx.js')
const folderTree = require('./tree.js')

// For test purposes, to be able to overwrite “message” with rewire.
var message = require('./message.js')

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
        let pianoFiles = folderTree.getFolderFiles(absSongFolder, '.eps')
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
    const eps = folderTree.getFolderFiles(path.join(resolvedSongPath, 'piano'), '.eps')
    var output = ''

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
  test: false,
  force: false
}

var config = {}

/**
 * By default this module reads the config file ~/.baldr to
 * generate its config object.
 * @param {object} newConfig - An object containing the same properties as the
 * config object.
 */
var bootstrapConfig = function (newConfig = false) {
  let { status, unavailable } = mscx.checkExecutables([
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
  var configFile = path.join(os.homedir(), '.baldr.json')
  var configFileExits = fs.existsSync(configFile)
  if (configFileExits) {
    config = Object.assign(config, require(configFile).songbook)
  }

  // function parameter
  if (newConfig) {
    config = Object.assign(config, newConfig)
  }

  if (!config.path || config.path.length === 0) {
    message.noConfigPath()
  }

  CheckChange.init(path.join(config.path, 'filehashes.db'))
}

/**
 * External function for command line usage.
 */
var setTestMode = function () {
  config.test = true
  config.path = path.resolve('test', 'songs', 'clean', 'some')
}

/**
 * Wrapper function for all process functions for one folder.
 * @param {string} folder - A song folder.
 */
var processSongFolder = function (folder) {
  let status = { changed: {}, generated: {} }

  status.folder = folder
  status.folderName = path.basename(folder)
  status.info = folderTree.getSongInfo(folder)

  status.force = config.force
  status.changed.slides = CheckChange.do(
    path.join(folder, 'projector.mscx')
  )
  // projector
  if (config.force || status.changed.slides) {
    status.generated.projector = mscx.generatePDF(folder, 'projector')
    status.generated.slides = mscx.generateSlides(folder)
  }

  if (
    CheckChange.do(path.join(folder, 'lead.mscx')) ||
      CheckChange.do(path.join(folder, 'piano.mscx'))
  ) {
    status.changed.piano = true
  } else {
    status.changed.piano = false
  }

  // piano
  if (config.force || status.changed.piano) {
    status.generated.piano = mscx.generatePianoEPS(folder)
  }
  return status
}

var updateSongFolder = function (folder) {
  message.songFolder(
    processSongFolder(folder)
  )
}

/**
 * Update and generate when required media files for the songs.
 */
var update = function () {
  mscx.gitPull(config.path)
  folderTree.flat(config.path).forEach(updateSongFolder)
  json.generateJSON(config.path)
  let tex = new TeX(config.path)
  tex.generateTeX()
}

/**
 *
 */
var cleanFiles = function (folder, files) {
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
var cleanFolder = function (folder) {
  cleanFiles(folder, [
    'piano',
    'slides',
    'projector.pdf'
  ])
}

/**
 * Clean all temporary media files.
 */
var clean = function () {
  folderTree.flat(config.path).forEach(cleanFolder)

  cleanFiles(config.path, [
    'songs.json',
    'songs.tex',
    'filehashes.db'
  ])
}

let generateJSON = function () {
  json.generateJSON(config.path)
}

let generateTeX = function () {
  let tex = new TeX(config.path)
  tex.generateTeX()
}

var setOptions = function (argv) {
  return commander
    .version(pckg.version)
    .option('-c, --clean', 'clean up (delete all generated files)')
    .option('-F, --folder <folder>', 'process only the given song folder')
    .option('-f, --force', 'rebuild all images')
    .option('-j, --json', 'generate JSON file')
    .option('-p --path <path>', 'Base path to a song collection.')
    .option('-T, --test', 'switch to test mode')
    .option('-t, --tex', 'generate TeX file')
    .parse(argv)
}

class Song {
  constructor (folder) {
    this.folder = folder
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

var main = function () {
  let options = setOptions(process.argv)

  if (options.folder) {
    options.force = true
  }

  let config = {
    folder: options.folder,
    force: options.force
  }

  if (options.path && options.path.length > 0) {
    config.path = options.path
  }

  bootstrapConfig(config)

  if (options.test) {
    setTestMode()
  }

  if (options.clean) {
    clean()
  } else if (options.folder) {
    updateSongFolder(options.folder)
  } else if (options.json) {
    generateJSON()
  } else if (options.tex) {
    generateTeX()
  } else {
    update()
  }
}

if (require.main === module) {
  main()
}

exports.Song = Song
exports.SongMetaData = SongMetaData
