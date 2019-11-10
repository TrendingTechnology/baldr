#! /usr/bin/env node

// Node packages.
const childProcess = require('child_process')
const fs = require('fs')
const path = require('path')

// Third party packages.
const commander = require('commander')
const chalk = require('chalk')
const yaml = require('js-yaml')
const musicMetadata = require('music-metadata')

// Project packages
const { Asset, walk, asciify, deasciify } = require('./main.js')
const { bootstrapConfig } = require('@bldr/core-node')

// Project packages.
const config = bootstrapConfig()

function makeAsset (mediaFile) {
  return new Asset(mediaFile).addFileInfos()
}

const presentationTemplate = `---
meta:
  title:
  id:
  grade:
  curriculum:

########################################################################
# Kommentare (Großer Kommentar)
########################################################################

##
# Normaler Kommentar
##

#
# Kleiner Kommentar
#

########################################################################
# Masters
########################################################################

slides:

##
# audio
##

- title: Kurzform
  audio: id:Fuer-Elise#complete

- title: Langform
  audio:
    src: Eine Medien-Datei-URI, z. B. id:Fuer-Elise oder eine Sample-URI (id:Fuer-Elise#complete). (required, mediaFileUri, types=String,Array)
    title: Der Titel des Audio-Ausschnitts. (markup, type=String)
    composer: Der/Die KomponistIn des Audio-Ausschnitts. (markup, type=String)
    artist: Der/Die InterpretIn des Audio-Ausschnitts. (markup, type=String)
    cover: Eine Medien-Datei-URI, die als Cover-Bild angezeigt werden soll. (mediaFileUri, type=String)
    autoplay: Den Audio-Ausschnitt automatisch abspielen. (type=Boolean)
    playthrough: Über die Folien hinwegspielen. Nicht stoppen beim Folienwechsel. (type=Boolean)


- camera: yes
- editor:
    markup:
- generic:
    markup:

##
# image
##

- title: Kurzform
  image: id:Luigi-Russolo_Arte-dei-rumori

- title: Langform
  image:
    src: Den URI zu einer Bild-Datei. (required, mediaFileUri, type=String)
    title: Ein Titel, der angezeigt wird. (markup, type=String)
    description: Eine Beschreibung, die angezeigt wird. (markup, type=String)

##
# person
##

- title: Kurzform
  person: id:Beethoven

- title: Langform
  person:
    name: Der Name der Person (type=String)
    image: Eine URI zu einer Bild-Datei. (required, mediaFileUri, type=String)
    birth: Datumsangabe zum Geburtstag (types=String,Number)
    death: Datumsangabe zum Todestag (types=String,Number)

##
# question
##

- title: Kurzform (nur eine Frage)
  question: Nur eine Frage?

- title: Kurzform (Frage-Antwort-Paar)
  question:
    question: Frage?
    answer: Antwort

- title: Langform
  question:
    heading: Eine Überschrift, die über den Fragen angezeigt wird. (markup, type=String)
    questions: Eine Liste mit Objekten mit den Schlüsseln question and answer. (required, markup, type=Array)
    numbers: Ob die Fragen nummeriert werden sollen. (default=true, type=Boolean)

- quote:
    text:
    author:
    date:
- score_sample:
    score:
    audio:
- task:
    markup:

##
# video
##

- title: Kurzform
  video: id:Luigi-Russolo_Arte-dei-rumori

- title: Langform
  video:
    src: Den URI zu einer Video-Datei. (required, mediaFileUri, type=String)

- youtube:
    id:
`

commander
  .version(require('../package.json').version)

/**
 * Categories some media file format in three media types: `audio`, `image`,
 * `video`.
 *
 * TODO: Code which can imported by ES modules and node modules.
 * The same code is in the module @bldr/api-media-server/src/cli.js and
 * @bldr/vue-component-media/src/main.js
 */
class MediaTypes {
  constructor () {
    /**
     * @type {object}
     */
    this.types = {
      audio: ['mp3', 'm4a', 'flac'],
      image: ['jpg', 'jpeg', 'png', 'svg'],
      video: ['mp4']
    }

    /**
     * If a media file should be converted we can use this object to
     * get the wanted target extensionl
     *
     * @type {object}
     */
    this.targetExtension = {
      audio: 'm4a',
      image: 'jpg',
      video: 'mp4'
    }

    /**
     * @type {object}
     */
    this.typeColors = {
      audio: 'brown',
      image: 'green',
      video: 'purple'
    }
    /**
     * @type {array}
     * @private
     */
    this.extensions_ = this.spreadExtensions_()
  }

  /**
   * @private
   */
  spreadExtensions_ () {
    const out = {}
    for (const type in this.types) {
      for (const extension of this.types[type]) {
        out[extension] = type
      }
    }
    return out
  }

  /**
   * Get the media type from the extension.
   *
   * @param {String} extension
   *
   * @returns {String}
   */
  extensionToType (extension) {
    const ext = extension.toLowerCase()
    if (ext in this.extensions_) {
      return this.extensions_[ext]
    }
    throw new Error(`Unkown extension “${ext}”`)
  }

  /**
   * Get the color of the media type.
   *
   * @param {String} type
   *
   * @returns {String}
   */
  typeToColor (type) {
    return this.typeColors[type]
  }

  /**
   * Check if file is an supported media format.
   *
   * @param {String} filename
   *
   * @returns {Boolean}
   */
  isMedia (filename) {
    const extension = filename.split('.').pop().toLowerCase()
    if (extension in this.extensions_) {
      return true
    }
    return false
  }
}

const mediaTypes = new MediaTypes()

/**
 * Write the metadata YAML file.
 *
 * @param {String} inputFile
 * @param {Object} metaData
 */
function writeMetaDataYaml (filePath, metaData) {
  const yamlFile = `${asciify(filePath)}.yml`
  if (!fs.lstatSync(filePath).isDirectory() && !fs.existsSync(yamlFile)) {
    if (!metaData) metaData = {}
    const asset = new Asset(filePath).addFileInfos()

    if (!metaData.title) {
      metaData.title = deasciify(asset.basename_)
    }

    if (!metaData.id) {
      metaData.id = asciify(asset.basename_)
    }

    const yamlMarkup = [
      '---',
      `# path: ${asset.path}`,
      `# filename: ${asset.filename}`,
      `# extension: ${asset.extension}`,
      yaml.safeDump(metaData)
    ]

    const result = yamlMarkup.join('\n')
    console.log(result)
    fs.writeFileSync(yamlFile, result)
  }
}

/**
 * Output from `music-metadata`:
 *
 * ```js
 * {
 *   format: {
 *     tagTypes: [ 'ID3v2.3', 'ID3v1' ],
 *     lossless: false,
 *     container: 'MPEG',
 *     codec: 'MP3',
 *     sampleRate: 44100,
 *     numberOfChannels: 2,
 *     bitrate: 192000,
 *     codecProfile: 'CBR',
 *     numberOfSamples: 18365184,
 *     duration: 416.4440816326531
 *   },
 *   native: undefined,
 *   quality: { warnings: [] },
 *   common: {
 *     track: { no: 2, of: 7 },
 *     disk: { no: 1, of: 1 },
 *     title: 'Symphonie fantastique, Op. 14: II. Un bal',
 *     artists: [ 'Hector Berlioz' ],
 *     artist: 'Hector Berlioz',
 *     album: 'Symphonie fantastique / Lélio',
 *     media: 'CD',
 *     originalyear: 1998,
 *     year: 1998,
 *     label: [ 'BMG Classics' ],
 *     artistsort: 'Berlioz, Hector',
 *     asin: 'B000006OPB',
 *     barcode: '090266893027',
 *     musicbrainz_recordingid: 'ca3b02af-b6be-4f95-8217-31126b2c2b67',
 *     catalognumber: [ '09026-68930-2' ],
 *     releasetype: [ 'album' ],
 *     releasecountry: 'US',
 *     acoustid_id: 'ed58118e-3b76-492b-9453-223d0ca72b86',
 *     musicbrainz_albumid: '986209e3-ce80-4b66-af78-22a035dde993',
 *     musicbrainz_artistid: [ '274774a7-1cde-486a-bc3d-375ec54d552d' ],
 *     albumartist: 'Berlioz; San Francisco Symphony & Chorus, Michael Tilson Thomas',
 *     musicbrainz_releasegroupid: '3a7e05b9-14fd-3cff-ac29-e568dd10a2a9',
 *     musicbrainz_trackid: 'c90eaa1c-2be5-4eba-a37e-fa3d1dfb0882',
 *     albumartistsort: 'Berlioz, Hector; San Francisco Symphony & San Francisco Symphony Chorus, Tilson Thomas, Michael',
 *     musicbrainz_albumartistid: [
 *       '274774a7-1cde-486a-bc3d-375ec54d552d',
 *       'deebc49a-6e06-418e-860f-8c7f770a8bac',
 *       '568d7c51-0573-4c65-9211-65bf8c8470c7',
 *       'f6df125a-a83c-4161-8cbe-48f4a3a7cad5'
 *     ],
 *     picture: [ [Object] ]
 *   }
 * }
 * ```
 *
 * @param {String} inputFile
 *
 * @returns {object}
 */
async function collectMusicMetaData (inputFile) {
  const metaData = await musicMetadata.parseFile(inputFile)

  if ('common' in metaData) {
    const output = {}
    const common = metaData.common
    for (const property of [
      ['title', 'title'],
      ['albumartist', 'artist'],
      ['artist', 'composer'],
      ['album', 'album'],
      ['year', 'recording_year'],
      ['musicbrainz_recordingid', 'musicbrainz_recording_id']
    ]) {
      if (property[0] in common && common[property[0]]) {
        output[property[1]] = common[property[0]]
      }
    }
    return output
  }
}

/**
 * Convert one input file.
 *
 * @param {String} inputFile - Path of the input file.
 * @param {Object} cmdObj - The command object from the commander.
 */
async function convertOneFile (inputFile, cmdObj) {
  const asset = makeAsset(inputFile)
  console.log(asset)

  const inputExtension = asset.extension.toLowerCase()
  let mediaType
  try {
    mediaType = mediaTypes.extensionToType(inputExtension)
  } catch (error) {
    console.log(`Unsupported extension ${inputExtension}`)
    return
  }
  const outputExtension = mediaTypes.targetExtension[mediaType]
  let outputFile = `${asciify(asset.basename_)}.${outputExtension}`

  let convert

  // audio
  // https://trac.ffmpeg.org/wiki/Encode/AAC

  // ffmpeg aac encoder
  // '-c:a', 'aac', '-b:a', '128k',

  // aac_he
  // '-c:a', 'libfdk_aac', '-profile:a', 'aac_he','-b:a', '64k',

  // aac_he_v2
  // '-c:a', 'libfdk_aac', '-profile:a', 'aac_he_v2'

  if (mediaType === 'audio') {
    convert = childProcess.spawn('ffmpeg', [
      '-i', inputFile,
      // '-c:a', 'aac', '-b:a', '128k',
      '-c:a', 'libfdk_aac', '-profile:a', 'aac_he', '-b:a', '64k',
      // '-c:a', 'libfdk_aac', '-profile:a', 'aac_he_v2',
      '-vn', // Disable video recording
      '-map_metadata', '-1', // remove metadata
      '-y', // Overwrite output files without asking
      outputFile
    ])

  // image
  } else if (mediaType === 'image') {
    let size = '2000x2000>'
    if (cmdObj.previewImage) {
      outputFile = inputFile.replace(`.${asset.extension}`, '_preview.jpg')
      size = '1000x1000>'
    }
    convert = childProcess.spawn('magick', [
      'convert',
      inputFile,
      '-resize', size, // http://www.imagemagick.org/Usage/resize/#shrink
      '-quality', '60', // https://imagemagick.org/script/command-line-options.php#quality
      outputFile
    ])

  // videos
  } else if (mediaType === 'video') {
    convert = childProcess.spawn('ffmpeg', [
      '-i', inputFile,
      '-vcodec', 'libx264',
      '-profile:v', 'baseline',
      '-y', // Overwrite output files without asking
      outputFile
    ])
  }

  if (convert) {
    convert.stdout.on('data', (data) => {
      console.log(chalk.green(data))
    })

    convert.stderr.on('data', (data) => {
      console.log(chalk.red(data))
    })

    convert.on('close', async (code) => {
      if (mediaType === 'audio') {
        const metaData = await collectMusicMetaData(inputFile)
        if (metaData) {
          writeMetaDataYaml(outputFile, metaData)
        }
      }
    })
  }
}

/**
 * Convert multiple files.
 *
 * @param {Array} inputFiles - An array of input files to convert.
 * @param {Object} cmdObj - The command object from the commander.
 */
function convert (inputFiles, cmdObj) {
  if (inputFiles.length === 0) {
    walk(process.cwd(), {
      all (inputFile) {
        convertOneFile(inputFile, cmdObj)
      }
    })
  } else {
    for (const inputFile of inputFiles) {
      convertOneFile(inputFile, cmdObj)
    }
  }
}

/**
 * @param {String} oldPath - The media file path.
 *
 * @returns {String}
 */
function renameOneFile (oldPath) {
  console.log(`old: ${oldPath}`)
  const   newPath = asciify(oldPath)
  if (oldPath !== newPath) {
    console.log(`new: ${newPath}`)
    fs.renameSync(oldPath, newPath)
    return newPath
  }
}

/**
 *
 */
function rename () {
  walk(process.cwd(), {
    all (oldPath) {
      renameOneFile(oldPath)
    }
  })
}

/**
 * @param {String} filePath - The media file path.
 */
function validateYamlOneFile (filePath) {
  console.log(`Validate: ${chalk.yellow(filePath)}`)
  try {
    const result = yaml.safeLoad(fs.readFileSync(filePath, 'utf8'))
    console.log(chalk.green('ok!'))
    console.log(result)
  } catch (error) {
    console.log(`${chalk.red(error.name)}: ${error.message}`)
  }
}

/**
 * @param {String} filePath - The media file path.
 */
function validateYaml (filePath) {
  if (filePath) {
    validateYamlOneFile(filePath)
  } else {
    walk(process.cwd(), {
      everyFile (relPath) {
        if (relPath.toLowerCase().indexOf('.yml') > -1) {
          validateYamlOneFile(relPath)
        }
      }
    })
  }
}

/**
 *
 */
function createMetaDataYaml() {
  walk(process.cwd(), {
    asset (relPath) {
      writeMetaDataYaml(relPath)
    }
  })
}

/**
 * Create a presentation template named “Praesentation.baldr.yml”.
 */
function createPresentationTemplate () {
  const filePath = path.join(process.cwd(), 'Praesentation.baldr.yml')
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, presentationTemplate)
    console.log(`Presentation template created at: ${chalk.green(filePath)}`)
  } else {
    console.log(`Presentation already exists: ${chalk.red(filePath)}`)
  }
}

/**
 *
 */
function openBasePath () {
  const process = childProcess.spawn('xdg-open', [config.mediaServer.basePath], { detached: true })
  process.unref()
}

/**
 * Create and open a relative path in different base paths.
 */
function mirrorRelPath () {
  const basePaths = [
    '/var/data/baldr/media/',
    '/home/jf/schule/',
    '/mnt/nnas/school/archive/'
  ]

  const currentBasePaths = []
  for (const basePath of basePaths) {
    if (fs.existsSync(basePath)) {
      currentBasePaths.push(basePath)
    }
  }

  console.log(`This base paths exist or are accessible: ${chalk.yellow(currentBasePaths)}`)

  const cwd = process.cwd()

  const regex = /^[a-zA-Z0-9-_/]+$/g
  if (!regex.test(cwd)) {
    console.log(`The current working directory “${chalk.red(cwd)}” contains illegal characters.`)
    return
  }

  function getRelPath () {
    for (const basePath of currentBasePaths) {
      if (cwd.indexOf(basePath) === 0) {
        return cwd.replace(basePath, '')

      }
    }
  }

  const relPath = getRelPath()
  if (!relPath) {
    console.log(`Move to one of this base paths: ${chalk.red(basePaths)}`)
  } else {
    console.log(`Base path detected. The relative path is: ${chalk.yellow(relPath)}`)
  }

  for (const basePath of currentBasePaths) {
    const absPath = path.join(basePath, relPath)
    if (!fs.existsSync(absPath)) {
      console.log(`Create directory: ${chalk.yellow(absPath)}`)
      fs.mkdirSync(absPath, { recursive: true })
    }
    console.log(`Open directory: ${chalk.green(absPath)}`)
    const process = childProcess.spawn('Thunar', [absPath], { detached: true })
    process.unref()
  }
}

commander
  .command('convert [input...]').alias('c')
  .option('-p, --preview-image', 'Convert into preview images (Smaller and different file name)')
  .description('Convert media files in the appropriate format. Multiple files, globbing works *.mp3')
  .action(convert)

commander
  .command('mirror').alias('m')
  .description('Create and open in the file explorer a relative path in different base paths.')
  .action(mirrorRelPath)

commander
  .command('open').alias('o')
  .description('Open the base directory in a file browser.')
  .action(openBasePath)

commander
  .command('rename').alias('r')
  .description('Rename files, clean file names, remove all whitespaces and special characters.')
  .action(rename)

commander
  .command('yaml').alias('y')
  .description('Create info files in the YAML format in the current working directory.')
  .action(createMetaDataYaml)

commander
  .command('yaml-validate [input]').alias('yv')
  .description('Validate the yaml files.')
  .action(validateYaml)

commander
  .command('presentation-template').alias('p')
  .description('Create a presentation template named “Praesentation.baldr.yml”.')
  .action(createPresentationTemplate)

commander.parse(process.argv)

function help () {
  console.log('Specify a subcommand.')
  commander.outputHelp()
  process.exit(1)
}

// [
//  '/usr/local/bin/node',
//  '/home/jf/.npm-packages/bin/baldr-media-server-cli'
// ]
if (process.argv.length <= 2) {
  help()
}
