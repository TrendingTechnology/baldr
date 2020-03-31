// Node packages.
const childProcess = require('child_process')
const fs = require('fs')
const path = require('path')

// Third party packages.
const yaml = require('js-yaml')
const chalk = require('chalk')

// Project packages.
const mediaServer = require('@bldr/media-server')
const { jsYamlConfig, getExtension, convertPropertiesCase } = require('@bldr/core-browser')

/**
 * @param {String} mediaFile
 *
 * @returns {module:@bldr/media-server~Asset}
 */
function makeAsset (mediaFile) {
  return new mediaServer.Asset(mediaFile).addFileInfos()
}

/**
 * @param {String} filePath
 *
 * @returns {String}
 */
function filePathToAssetType (filePath) {
  const asset = makeAsset(filePath)
  const inputExtension = asset.extension.toLowerCase()
  return mediaServer.assetTypes.extensionToType(inputExtension)
}

/**
 * Read the corresponding YAML file of a media asset.
 *
 * @param {String} filePath - The path of the media asset.
 *
 * @returns {Object}
 */
function readAssetYaml (filePath) {
  const extension = getExtension(filePath)
  if (extension !== 'yml') filePath = `${filePath}.yml`
  if (fs.existsSync(filePath)) {
    let data = yaml.safeLoad(readFile(filePath))
    data = convertPropertiesCase(data, 'snake-to-camel')
    return data
  }
}

/**
 * Convert a Javascript object into a text string, ready to be written into
 * a text file.
 *
 * @param {Object} data - Some data to convert to YAML.
 *
 * @returns {String}
 */
function yamlToTxt (data) {
  data = convertPropertiesCase(data, 'camel-to-snake')
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
    metaData = normalizeMetaData(filePath, metaData)
    writeYamlFile(yamlFile, metaData)
    return {
      filePath,
      yamlFile,
      metaData
    }
  }
  return {
    filePath,
    msg: 'No action.'
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
    if (metaData.id.indexOf(idPrefix) === -1) {
      metaData.id = `${idPrefix}_${metaData.id}`
    }

    // Avoid duplicate idPrefixes by changed prefixes:
    // instead of:
    // Piazzolla-Nonino_NB_Piazzolla-Adios-Nonino_NB_Adios-Nonino_melancolico
    // old prefix: Piazzolla-Adios-Nonino_NB
    // updated prefix: Piazzolla-Nonino_NB
    // Preferred result: Piazzolla-Nonino_NB_Adios-Nonino_melancolico
    if (metaData.id.match(/.*_[A-Z]{2,}_.*/)) {
      metaData.id = metaData.id.replace(/^.*_[A-Z]{2,}/, idPrefix)
    }
  }

  return metaData
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
 * Move (rename) or copy a media asset and it’s corresponding meta data file
 * (`*.yml`) and preview file (`_preview.jpg`).
 *
 * @param {String} oldPath - The old path of a media asset.
 * @param {String} newPath - The new path of a media asset.
 * @param {Object} opts - Some options
 * @property {Boolean} opts.copy
 * @property {Boolean} opts.dryRun
 */
function moveAsset (oldPath, newPath, opts) {
  if (!opts) opts = {}

  function move(oldPath, newPath, { copy, dryRun }) {
    if (fs.existsSync(newPath)) {
      console.log(`Exists: ${chalk.red(newPath)}`)
    }
    let action
    const dryRunMsg = dryRun ? '[dry run] ' : ''
    if (copy) {
      if (!dryRun) fs.copyFileSync(oldPath, newPath)
      action = 'copy'
    } else {
      if (!dryRun) {
        //  Error: EXDEV: cross-device link not permitted,
        try {
          fs.renameSync(oldPath, newPath)
        } catch (error) {
          if (error.code === 'EXDEV') {
            fs.copyFileSync(oldPath, newPath)
            fs.unlinkSync(oldPath)
          }
        }
      }
      action = 'move'
    }
    console.log(`${dryRunMsg}${action}: ${chalk.yellow(oldPath)} -> ${chalk.green(newPath)}`)
  }

  function moveCorrespondingFile (oldPath, newPath, search, replace, opts) {
    oldPath = oldPath.replace(search, replace)
    if (fs.existsSync(oldPath)) {
      newPath = newPath.replace(search, replace)
      move(oldPath, newPath, opts)
    }
  }

  if (newPath && oldPath !== newPath) {
    if (!opts.dryRun) fs.mkdirSync(path.dirname(newPath), { recursive: true })

    const extension = getExtension(oldPath)
    if (extension === 'eps') {
      // Dippermouth-Blues.eps
      // Dippermouth-Blues.mscx
      moveCorrespondingFile(oldPath, newPath, /\.eps$/, '.mscx', opts)
      // Dippermouth-Blues-eps-converted-to.pdf
      moveCorrespondingFile(oldPath, newPath, /\.eps$/, '-eps-converted-to.pdf', opts)
    }

    // Beethoven.mp4 Beethoven.mp4.yml Beethoven.mp4_preview.jpg
    for (const suffix of ['.yml', '_preview.jpg']) {
      if (fs.existsSync(`${oldPath}${suffix}`)) {
        move(`${oldPath}${suffix}`, `${newPath}${suffix}`, opts)
      }
    }
    move(oldPath, newPath, opts)
    return newPath
  }
}

module.exports = {
  filePathToAssetType,
  makeAsset,
  normalizeMetaData,
  moveAsset,
  readAssetYaml,
  readFile,
  runImagemagick,
  writeFile,
  writeMetaDataYaml,
  writeYamlFile,
  yamlToTxt
}
