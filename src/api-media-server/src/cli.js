#! /usr/bin/env node

// Node packages.
const childProcess = require('child_process')
const fs = require('fs')
const path = require('path')

// Third party packages.
const commander = require('commander')
const chalk = require('chalk')
const yaml = require('js-yaml')
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

/** -h / --help ***************************************************************/

function actionHelp () {
  console.log('Specify a subcommand.')
  commander.outputHelp()
  process.exit(1)
}

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

/** -v / --version ************************************************************/

commander
  .version(require('../package.json').version)

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
