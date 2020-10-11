/**
 * @module @bldr/cli/lib
 */

// Node packages.
const childProcess = require('child_process')
const fs = require('fs')
const path = require('path')
const URL = require('url').URL

// Third party packages.
const yaml = require('js-yaml')
const chalk = require('chalk')
const fetch = require('node-fetch').default

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
 * @param {String} filePath - The path of the media asset (without the
 *   extension `.yml`).
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

    metaData = mediaServer.metaTypes.process(metaData)
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
 * TODO: Remove and use version in @bldr/media-manager.
 *
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
 * TODO: Remove and use version in @bldr/media-manager.
 *
 * Write some content to a file.
 *
 * @param {String} filePath
 * @param {String} content
 */
function writeFile (filePath, content) {
  fs.writeFileSync(filePath, content)
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

  function move (oldPath, newPath, { copy, dryRun }) {
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

/**
 * Download a URL to a destination.
 *
 * @param {String} url - The URL.
 * @param {String} dest - The destination. Missing parent directories are automatically created.
 */
async function fetchFile (url, dest) {
  const response = await fetch(new URL(url))
  fs.mkdirSync(path.dirname(dest), { recursive: true })
  fs.writeFileSync(dest, Buffer.from(await response.arrayBuffer()))
}

/**
 * Load a YAML file. Only return objects to save vscode type checks.
 *
 * @param {String} filePath
 *
 * @returns {Object}
 */
function loadYaml (filePath) {
  const result = yaml.safeLoad(readFile(filePath))
  if (typeof result !== 'object') {
    return { result }
  }
  return result
}

module.exports = {
  fetchFile,
  filePathToAssetType,
  makeAsset,
  moveAsset,
  readAssetYaml,
  readFile,
  runImagemagick,
  loadYaml,
  writeFile,
  writeMetaDataYaml,
  writeYamlFile,
  yamlToTxt
}
