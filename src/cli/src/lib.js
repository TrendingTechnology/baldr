// Node packages.
const childProcess = require('child_process')
const fs = require('fs')
const path = require('path')

// Third party packages.
const yaml = require('js-yaml')
const chalk = require('chalk')

// Project packages.
const mediaServer = require('@bldr/api-media-server')
const { jsYamlConfig } = require('@bldr/core-browser')

/**
 *
 * @param {String} mediaFile
 */
function makeAsset (mediaFile) {
  return new mediaServer.Asset(mediaFile).addFileInfos()
}

/**
 *
 * @param {String} filePath
 */
function filePathToAssetType (filePath) {
  const asset = makeAsset(filePath)
  const inputExtension = asset.extension.toLowerCase()
  return mediaServer.assetTypes.extensionToType(inputExtension)
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
 * Convert some data (usually Javascript objets) into the YAML format and write
 * the string into a text file.
 *
 * @param {String} filePath - The file path of the destination yaml file. The
 *   yml extension has to be included.
 * @param {Object} data - Some data to convert into yaml and write into a text
 *   file.
 *
 * @returns {String} - The data converted to YAML as a string.
 */
function writeYamlFile (filePath, data) {
  const yaml = yamlToTxt(data)
  fs.writeFileSync(filePath, yaml)
  return yaml
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
  const yamlFile = `${mediaServer.asciify(filePath)}.yml`
  if (
    force ||
    !fs.existsSync(yamlFile)
  ) {
    if (!metaData) metaData = {}
    const asset = new mediaServer.Asset(filePath).addFileInfos()
    if (!metaData.id) {
      metaData.id = asset.basename_
    }
    if (!metaData.title) {
      metaData.title = mediaServer.deasciify(asset.basename_)
    }
    writeYamlFile(yamlFile, normalizeMetaData(filePath, metaData))
  }
}

/**
 * Read the content of a file in the `utf-8` format.
 *
 * A wrapper around `fs.readFileSync()`
 *
 * @param {String} filePath
 *
 * @returns {String} - The content of the file in the `utf-8` format.
 */
function readFile (filePath) {
  return fs.readFileSync(filePath, { encoding: 'utf-8' })
}

/**
 *
 * @param {String} filePath
 * @param {String} content
 */
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

/**
 * TODO: replace code inside actionConvert() with this function.
 *
 * @param {String} inputFile
 * @param {String} outputFile
 * @param {String} size - see http://www.imagemagick.org/Usage/resize
 */
function runImagemagick (inputFile, outputFile, size = '2000x2000>') {
  childProcess.spawnSync('magick', [
    'convert',
    inputFile,
    '-resize', size, // http://www.imagemagick.org/Usage/resize/#shrink
    '-quality', '60', // https://imagemagick.org/script/command-line-options.php#quality
    outputFile
  ])
}

/**
 * Rename a media asset and it’s corresponding meta data file (`*.yml`) and
 * preview file (`_preview.jpg`).
 *
 * @param {String} oldPath - The old path of a media asset.
 * @param {String} newPath - The new path of a media asset.
 */
function renameAsset (oldPath, newPath, copy) {
  function move(oldPath, newPath, copy) {
    if (copy) {
      fs.copyFileSync(oldPath, newPath)
    } else {
      fs.renameSync(oldPath, newPath)
    }
  }
  const cwd = process.cwd()
  const oldRelPath = oldPath.replace(cwd, '')
  console.log(`old: ${chalk.yellow(oldRelPath)}`)
  if (newPath && oldPath !== newPath) {
    fs.mkdirSync(path.dirname(newPath), { recursive: true })
    const newRelPath = newPath.replace(cwd, '')
    console.log(`new: ${chalk.green(newRelPath)}`)
    for (const suffix of ['.yml', '_preview.jpg']) {
      if (fs.existsSync(`${oldPath}${suffix}`)) {
        move(`${oldPath}${suffix}`, `${newPath}${suffix}`, copy)
        console.log(`new: ${chalk.cyan(newRelPath + suffix)}`)
      }
    }
    move(oldPath, newPath, copy)
    return newPath
  }
}

module.exports = {
  filePathToAssetType,
  makeAsset,
  normalizeMetaData,
  readFile,
  renameAsset,
  runImagemagick,
  semanticMarkupHtmlToTex,
  semanticMarkupTexToHtml,
  writeFile,
  writeMetaDataYaml,
  writeYamlFile,
  yamlToTxt
}
