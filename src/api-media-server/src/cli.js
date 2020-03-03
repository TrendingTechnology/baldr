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
const glob = require('glob')

// Project packages.
const {
  asciify,
  Asset,
  assetTypes,
  deasciify,
  FolderTitleTree,
  HierarchicalFolderTitles,
  walk,
  walkDeluxe
} = require('./main.js')
const { bootstrapConfig, checkExecutables } = require('@bldr/core-node')
const { formatMultiPartAssetFileName, jsYamlConfig } = require('@bldr/core-browser')

checkExecutables(['magick', 'ffmpeg', 'lualatex', 'xdg-open', 'pdf2svg', 'pdfinfo'])

const config = bootstrapConfig()

/*******************************************************************************
 * Common functions
 ******************************************************************************/

function makeAsset (mediaFile) {
  return new Asset(mediaFile).addFileInfos()
}

function filePathToAssetType (filePath) {
  const asset = makeAsset(filePath)
  const inputExtension = asset.extension.toLowerCase()
  return assetTypes.extensionToType(inputExtension)
}

/**
 * \stueck*{Nachtmusik} -> <em class="piece">„Nachtmusik“<em>
 * \stueck{Nachtmusik} -> <em class="piece">Nachtmusik<em>
 * \person{Mozart} -> <em class="person">Mozart<em>
 */
function semanticMarkupTexToHtml (text) {
  console.log(text)
  text = text.replace(/\\stueck\*\{([^\}]+?)\}/g, '<em class="piece">„$1“</em>')
  text = text.replace(/\\stueck\{([^\}]+?)\}/g, '<em class="piece">$1</em>')
  text = text.replace(/\\person\{([^\}]+?)\}/g, '<em class="person">$1</em>')
  return text
}

/**
 * \stueck*{Nachtmusik} <- <em class="piece">„Nachtmusik“<em>
 * \stueck{Nachtmusik} <- <em class="piece">Nachtmusik<em>
 * \person{Mozart} <- <em class="person">Mozart<em>
 */
function semanticMarkupHtmlToTex (text) {
  text = text.replace(/<em class="piece">„([^<>]+?)“<\/em>/g, '\\stueck*{$1}')
  text = text.replace(/<em class="piece">([^<>]+?)<\/em>/g, '\\stueck{$1}')
  text = text.replace(/<em class="person">([^<>]+?)<\/em>/g, '\\person{$1}')
  return text
}

/**
 * Convert a Javascript object into a text string, ready to be written into
 * a text file.
 *
 * @param {Object} data - Some data to convert to YAML.
 */
function yamlToTxt (data) {
  const yamlMarkup = [
    '---',
    yaml.safeDump(data, jsYamlConfig)
  ]
  return yamlMarkup.join('\n')
}

/**
 * Create and write the meta data YAML to the disk.
 *
 * @param {String} filePath - The file path of the destination yaml file. The yml
 *   extension has to be included.
 * @param {Object} metaData - The object to convert into yaml and write to
 *   the disk.
 */
function writeMetaDataYamlFile (filePath, metaData) {
  const result = yamlToTxt(metaData)
  console.log(result)
  fs.writeFileSync(filePath, result)
}

/**
 * Write the metadata YAML file for a corresponding media file specified by
 * `filePath`.
 *
 * @param {String} filePath - The filePath gets asciified and a yml extension
 *   is appended.
 * @param {Object} metaData
 * @param {Boolean} force - Always create the yaml file. Overwrite the old one.
 */
function writeMetaDataYaml (filePath, metaData, force) {
  if (fs.lstatSync(filePath).isDirectory()) return
  const yamlFile = `${asciify(filePath)}.yml`
  if (
    force ||
    !fs.existsSync(yamlFile)
  ) {
    if (!metaData) metaData = {}
    const asset = new Asset(filePath).addFileInfos()
    if (!metaData.id) {
      metaData.id = asset.basename_
    }
    if (!metaData.title) {
      metaData.title = deasciify(asset.basename_)
    }
    writeMetaDataYamlFile(yamlFile, normalizeMetaData(filePath, metaData))
  }
}

/**
 * Rename a media asset and it’s corresponding meta data file (`*.yml`) and
 * preview file (`_preview.jpg`).
 *
 * @param {String} oldPath - The old path of a media asset.
 * @param {String} newPath - The new path of a media asset.
 */
function renameAsset (oldPath, newPath) {
  const oldRelPath = oldPath.replace(process.cwd(), '')
  console.log(`old: ${chalk.yellow(oldRelPath)}`)
  if (newPath && oldPath !== newPath) {
    const newRelPath = newPath.replace(process.cwd(), '')
    console.log(`new: ${chalk.green(newRelPath)}`)
    if (fs.existsSync(`${oldPath}.yml`)) {
      fs.renameSync(`${oldPath}.yml`, `${newPath}.yml`)
      console.log(`new: ${chalk.cyan(newRelPath + '.yml')}`)
    }
    if (fs.existsSync(`${oldPath}_preview.jpg`)) {
      fs.renameSync(`${oldPath}_preview.jpg`, `${newPath}_preview.jpg`)
      console.log(`new: ${chalk.cyan(newRelPath + '_preview.jpg')}`)
    }
    fs.renameSync(oldPath, newPath)
    return newPath
  }
}

function readFile (filePath) {
  return fs.readFileSync(filePath, { encoding: 'utf-8' })
}

function writeFile (filePath, content) {
  fs.writeFileSync(filePath, content)
}

/**
 * Sort the keys and clean up some entires.
 *
 * @param {String} filePath - The media asset file path.
 * @param {Object} metaData - The object representation of the yaml meta data
 *   file.
 */
function normalizeMetaData (filePath, metaData) {
  const normalized = {}

  // a-Strawinsky-Petruschka-Abschnitt-0_22
  if (metaData.id) metaData.id = metaData.id.replace(/^[va]-/, '')
  // a Strawinsky Petruschka Abschnitt 0_22
  if (metaData.title) metaData.title = metaData.title.replace(/^[va] /, '')

  for (const key of ['id', 'title', 'description', 'composer']) {
    if (key in metaData) {
      normalized[key] = metaData[key]
      delete metaData[key]
    }
  }

  // HB_Ausstellung_Gnome -> Ausstellung_HB_Gnome
  normalized.id = normalized.id.replace(/^([A-Z]{2,})_([a-zA-Z0-9-]+)_/, '$2_$1_')

  /**
   * Generate a ID prefix for media assets, like `Presentation-ID_HB` if the
   * path of the media file is `10_Presentation-id/HB/example.mp3`.
   *
   * @param {String} filePath - The media asset file path.
   */
  function generateIdPrefix (filePath) {
    // We need the absolute path
    filePath = path.resolve(filePath)
    const pathSegments = filePath.split(path.sep)
    // HB
    const parentDir = pathSegments[pathSegments.length - 2]
    // Match asset type abbreviations, like AB, HB, NB
    if (parentDir.length !== 2 || !parentDir.match(/[A-Z]{2,}/)) {
      return
    }
    const assetTypeAbbreviation = parentDir
    // 20_Strawinsky-Petruschka
    const subParentDir = pathSegments[pathSegments.length - 3]
    // Strawinsky-Petruschka
    const presentationId = subParentDir.replace(/^[0-9]{2,}_/, '')
    // Strawinsky-Petruschka_HB
    const idPrefix = `${presentationId}_${assetTypeAbbreviation}`
    return idPrefix
  }

  const idPrefix = generateIdPrefix(filePath)
  if (idPrefix) {
    if (normalized.id.indexOf(idPrefix) === -1) {
      normalized.id = `${idPrefix}_${normalized.id}`
    }

    // Avoid duplicate idPrefixes by changed prefixes:
    // instead of:
    // Piazzolla-Nonino_NB_Piazzolla-Adios-Nonino_NB_Adios-Nonino_melancolico
    // old prefix: Piazzolla-Adios-Nonino_NB
    // updated prefix: Piazzolla-Nonino_NB
    // Preferred result: Piazzolla-Nonino_NB_Adios-Nonino_melancolico
    if (normalized.id.match(/.*_[A-Z]{2,}_.*/)) {
      normalized.id = normalized.id.replace(/^.*_[A-Z]{2,}/, idPrefix)
    }
  }

  for (const key in metaData) {
    if (metaData.hasOwnProperty(key)) {
      normalized[key] = metaData[key]
      delete metaData[key]
    }
  }

  // title: 'Tonart CD 4: Spur 29'
  if ('title' in normalized && normalized.title.match(/.+CD.+Spur/)) {
    delete normalized.title
  }

  // composer: Helbling-Verlag
  if ('composer' in normalized && normalized.composer.indexOf('Verlag') > -1) {
    delete normalized.composer
  }

  return normalized
}

/*******************************************************************************
 * Subcommands
 ******************************************************************************/

/** c / convert ***************************************************************/

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
      ['musicbrainz_recordingid', 'musicbrainz_recording_id']
    ]) {
      if (property[0] in common && common[property[0]]) {
        output[property[1]] = common[property[0]]
      }
    }
    if (output.album && output.title) {
      output.title = `${output.album}: ${output.title}`
      delete output.album
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
  let assetType
  try {
    assetType = assetTypes.extensionToType(inputExtension)
  } catch (error) {
    console.log(`Unsupported extension ${inputExtension}`)
    return
  }
  const outputExtension = assetTypes.typeToTargetExtension(assetType)
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

  if (assetType === 'audio') {
    convert = childProcess.spawn('ffmpeg', [
      '-i', inputFile,
      // '-c:a', 'aac', '-b:a', '128k',
      // '-c:a', 'libfdk_aac', '-profile:a', 'aac_he', '-b:a', '64k',
      '-c:a', 'libfdk_aac', '-profile:a', 'aac_he_v2',
      '-vn', // Disable video recording
      '-map_metadata', '-1', // remove metadata
      '-y', // Overwrite output files without asking
      outputFile
    ])

  // image
  } else if (assetType === 'image') {
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
  } else if (assetType === 'video') {
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
      if (assetType === 'audio') {
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
function actionConvert (inputFiles, cmdObj) {
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

commander
  .command('convert [input...]').alias('c')
  .option('-p, --preview-image', 'Convert into preview images (Smaller and different file name)')
  .description('Convert media files in the appropriate format. Multiple files, globbing works *.mp3')
  .action(actionConvert)

/** -h / --help ***************************************************************/

function actionHelp () {
  console.log('Specify a subcommand.')
  commander.outputHelp()
  process.exit(1)
}

/** i / id-to-filename ********************************************************/

/**
 * Rename a media asset after the `id` in the meta data file.
 *
 * @param {String} filePath - The media asset file path.
 */
function renameFromIdOneFile (filePath) {
  let result
  try {
    result = yaml.safeLoad(fs.readFileSync(`${filePath}.yml`, 'utf8'))
  } catch (error) {
    console.log(filePath)
    console.log(error)
    return
  }

  if ('id' in result && result.id) {
    let id = result.id
    const oldPath = filePath

    // .mp4
    const extension = path.extname(oldPath)
    const oldBaseName = path.basename(oldPath, extension)
    let newPath = null
    // Gregorianik_HB_Alleluia-Ostermesse -> Alleluia-Ostermesse
    id = id.replace(/.*_[A-Z]{2,}_/, '')
    console.log(id)
    if (id !== oldBaseName) {
      newPath = path.join(path.dirname(oldPath), `${id}${extension}`)
    } else {
      return
    }
    renameAsset(oldPath, newPath)
  }
}

/**
 * Rename a media asset or all child asset of the parent working directory
 * after the `id` in the meta data file.
 *
 * @param {String} filePath - The media file path.
 */
function actionIdToFilename (filePath) {
  if (filePath) {
    renameFromIdOneFile(filePath)
  } else {
    walk(process.cwd(), {
      asset (relPath) {
        if (fs.existsSync(`${relPath}.yml`)) {
          renameFromIdOneFile(relPath)
        }
      }
    })
  }
}

commander
  .command('id-to-filename [input]').alias('i')
  .description('Rename media assets after the id.')
  .action(actionIdToFilename)

/** mp / multipart ************************************************************/

function actionMultipart (globPattern, prefix) {
  const files = glob.sync(globPattern)
  if (files.length < 1) {
    console.log('Glob matches no files.')
    return
  }
  files.sort()
  console.log(files)
  let no = 1
  const extension = files[0].split('.').pop()
  for (const oldFileName of files) {
    const newFileName = formatMultiPartAssetFileName(`${prefix}.${extension}`, no)
    console.log(`${oldFileName} -> ${newFileName}`)
    fs.renameSync(oldFileName, newFileName)
    no += 1
  }
}

commander
  .command('multipart <glob> <prefix>').alias('mp')
  .description('Rename multipart assets.')
  .action(actionMultipart)

/** n / normalize *************************************************************/

/**
 * @param {String} filePath - The media asset file path.
 */
function normalizeMetaDataYamlOneFile (filePath) {
  const yamlFile = `${filePath}.yml`
  const metaData = yaml.safeLoad(fs.readFileSync(yamlFile, 'utf8'))
  writeMetaDataYamlFile(yamlFile, normalizeMetaData(filePath, metaData))
}

/**
 * @param {String} filePath - The media asset file path.
 */
function actionNormalize (filePath) {
  if (filePath) {
    normalizeMetaDataYamlOneFile(filePath)
  } else {
    walk(process.cwd(), {
      asset (relPath) {
        if (fs.existsSync(`${relPath}.yml`)) {
          normalizeMetaDataYamlOneFile(relPath)
        }
      }
    })
  }
}

commander
  .command('normalize [input]').alias('n')
  .description('Normalize the meta data files in the YAML format (Sort, clean up).')
  .action(actionNormalize)

/** p / presentation-template *************************************************/

const presentationTemplate = `---
meta:
  title:
  subtitle:
  id:
  grade:
  curriculum:
  curriculum_url:

slides:

- generic: Hello world
`

/**
 * Create a presentation template named “Praesentation.baldr.yml”.
 */
function presentationFromTemplate (filePath) {
  fs.writeFileSync(filePath, presentationTemplate)
}

/**
 * Create a Praesentation.baldr.yml file and insert all media assets in the
 * presentation.
 *
 * @param {String} filePath - The file path of the new created presentation
 *   template.
 */
async function presentationFromAssets (filePath) {
  const slides = []
  await walk(process.cwd(), {
    asset (relPath) {
      const asset = makeAsset(relPath)
      if (!asset.id) {
        console.log(`Asset has no ID: ${chalk.red(relPath)}`)
        return
      }
      console.log(asset)
      let masterName
      if (asset.id.indexOf('NB') > -1) {
        masterName = 'score_sample'
      } else {
        masterName = asset.assetType
      }
      slides.push(
        {
          [masterName]: `id:${asset.id}`
        }
      )
    }
  })
  const result = yamlToTxt({
    slides
  })
  console.log(result)
  fs.writeFileSync(filePath, result)
}

async function actionPresentationTemplate (command) {
  let filePath = path.join(process.cwd(), 'Praesentation.baldr.yml')
  if (!fs.existsSync(filePath)) {
    console.log(`Presentation template created at: ${chalk.green(filePath)}`)
  } else {
    filePath = filePath.replace('.baldr.yml', '_tmp.baldr.yml')
    console.log(`Presentation already exists, create tmp file: ${chalk.red(filePath)}`)
  }

  if (command.fromAssets) {
    await presentationFromAssets(filePath)
  } else {
    presentationFromTemplate(filePath)
  }
}

commander
  .command('presentation-template').alias('p')
  .option('-a, --from-assets', 'Create a presentation from the assets of the current working dir.')
  .description('Create a presentation template named “Praesentation.baldr.yml”.')
  .action(actionPresentationTemplate)

/** t / folder-title **********************************************************/

async function actionFolderTitles (filePath) {
  const tree = new FolderTitleTree()

  function read (filePath) {
    const titles = new HierarchicalFolderTitles(filePath)
    tree.add(titles)
    console.log(titles.all)
    console.log(`  id: ${chalk.cyan(titles.id)}`)
    console.log(`  title: ${chalk.yellow(titles.title)}`)
    if (titles.subtitle) console.log(`  subtitle: ${chalk.green(titles.subtitle)}`)
    console.log(`  curriculum: ${chalk.red(titles.curriculum)}`)
    console.log(`  grade: ${chalk.red(titles.grade)}`)
  }

  if (filePath) {
    read(filePath)
  } else {
    await walk(process.cwd(), {
      presentation (relPath) {
        read(relPath)
      }
    })
  }
  console.log(JSON.stringify(tree.tree_, null, 2))
}

commander
  .command('folder-title [input]').alias('t')
  .description('List all hierachical folder titles')
  .action(actionFolderTitles)

function convertTexToFolderTitles (filePath) {
  function clean (text) {
    text = text.replace(/\n/g, ' ')
    text = text.replace(/\s+/g, ' ')
    text = semanticMarkupTexToHtml(text)
    return text
  }
  console.log(filePath)
  const content = readFile(filePath)
  const title = content.match(/  titel = \{(.+?)\}[,\n]/s)
  output = []
  if (title) {
    output.push(clean(title[1]))
  }

  const untertitel = content.match(/  untertitel = \{(.+?)\}[,\n]/s)
  if (untertitel) {
    output.push(clean(untertitel[1]))
  }
  console.log(output)
  if (output.length > 0) {
    writeFile(path.join(path.dirname(filePath), 'title_tmp.txt'), output.join('\n') + '\n')
  }
}

function actionTexToFolderTitles (filePath) {
  walkDeluxe(convertTexToFolderTitles, new RegExp('.*\.tex$'), filePath)
}

commander
  .command('tex-folder-title [input]').alias('tf')
  .description('TeX files to folder titles title.txt')
  .action(actionTexToFolderTitles)

/** tt / title-tex ************************************************************/

/**
 * ```tex
 * \setzetitel{
 *   jahrgangsstufe = {6},
 *   ebenei = {Musik und ihre Grundlagen},
 *   ebeneii = {Systeme und Strukturen},
 *   ebeneiii = {die Tongeschlechter Dur und Moll},
 *   titel = {Dur- und Moll-Tonleiter},
 *   untertitel = {Das Lied \emph{„Kol dodi“} in Moll und Dur},
 * }
 * ```
 *
 * @param {String} filePath - The path of a TeX file.
 */
function patchTexFileWithTitles (filePath) {
  console.log(filePath)
  const titles = new HierarchicalFolderTitles(filePath)

  const setzeTitle = {
    jahrgangsstufe: titles.grade
  }

  const ebenen = ['ebenei', 'ebeneii', 'ebeneiii', 'ebeneiv', 'ebenev']
  for (let index = 0; index < titles.curriculumTitlesArray.length; index++) {
    setzeTitle[ebenen[index]] = titles.curriculumTitlesArray[index]
  }
  setzeTitle.titel = titles.title
  if (titles.subtitle) {
    setzeTitle.untertitel = titles.subtitle
  }

  // Replace semantic markup
  for (const key in setzeTitle) {
    setzeTitle[key] = semanticMarkupHtmlToTex(setzeTitle[key])
  }

  const lines = ['\\setzetitel{']
  for (const key in setzeTitle) {
    lines.push(`  ${key} = {${setzeTitle[key]}},`)
  }
  lines.push('}')
  lines.push('') // to get a empty line

  let texFileString = fs.readFileSync(filePath, { encoding: 'utf-8' })
  texFileString = texFileString.replace(
    /\\setzetitel\{.+?,?\n\}\n/s, // /s s (dotall) modifier, +? one or more (non-greedy)
    lines.join('\n')
  )
  fs.writeFileSync(filePath, texFileString)
}

function actionTitleTex (filePath) {
  walkDeluxe(patchTexFileWithTitles, new RegExp('.*\.tex$'), filePath)
}

commander
  .command('title-tex [input]').alias('tt')
  .description('Replace title section of the TeX files with metadata retrieved from the title.txt files.')
  .action(actionTitleTex)

/** v / video-preview *********************************************************/

function createVideoPreviewImageOneFile (filePath, second) {
  const assetType = filePathToAssetType(filePath)
  if (assetType === 'video') {
    const output = `${filePath}_preview.jpg`
    const outputFileName = path.basename(output)
    console.log(`Preview image: ${chalk.green(outputFileName)} at second ${chalk.green(second)})`)
    childProcess.spawnSync('ffmpeg', [
      '-i', filePath,
      '-ss', second, // Position in seconds
      '-vframes', '1', // only handle one video frame
      '-qscale:v', '10', // Effective range for JPEG is 2-31 with 31 being the worst quality.
      '-y', // Overwrite output files without asking
      output
    ])
  }
}

function actionVideoPreview (filePath, second = 10) {
  if (filePath) {
    createVideoPreviewImageOneFile(filePath, second)
  } else {
    walk(process.cwd(), {
      asset (relPath) {
        createVideoPreviewImageOneFile(relPath, second)
      }
    })
  }
}

commander
  .command('video-preview [input] [second]').alias('v')
  .description('Create video preview images')
  .action(actionVideoPreview)

/** -v / --version ************************************************************/

commander
  .version(require('../package.json').version)

/** y / yaml ******************************************************************/

/**
 *
 */
function actionYaml (filePath) {
  if (filePath) {
    writeMetaDataYaml(filePath)
  } else {
    walk(process.cwd(), {
      asset (relPath) {
        writeMetaDataYaml(relPath)
      }
    })
  }
}

commander
  .command('yaml [input]').alias('y')
  .description('Create info files in the YAML format in the current working directory.')
  .action(actionYaml)

/** yv / yaml-validate ********************************************************/

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
function actionYamlValidate (filePath) {
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

commander
  .command('yaml-validate [input]').alias('yv')
  .description('Validate the yaml files.')
  .action(actionYamlValidate)

/*******************************************************************************
 * main
 ******************************************************************************/

commander.parse(process.argv)

// [
//  '/usr/local/bin/node',
//  '/home/jf/.npm-packages/bin/baldr-media-server-cli'
// ]
if (process.argv.length <= 2) {
  actionHelp()
}
