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
const { Asset, walk } = require('./main.js')
const { bootstrapConfig } = require('@bldr/core-node')

// Project packages.
const config = bootstrapConfig()

function makeAsset (mediaFile) {
  return new Asset(mediaFile).addFileInfos()
}

const templateBaldrYml = `---
meta:
  title:
  id:

slides:
- generic: Hello World!

# - audio:
#     src:
#     title:
#     artist:
#     composer:
#     autoplay:
#     playthrough:
#     cover:
# - camera: yes
# - editor:
#     markup:
# - generic:
#     markup:
# - image:
#     src:
#     title:
#     description:
# - person:
#     name:
#     image:
#     birth:
#     death:
# - question:
#     heading:
#     questions:
#     numbers:
# - quote:
#     text:
#     author:
#     date:
# - task:
#     markup:
# - video:
#     src:
`

commander
  .version(require('../package.json').version)

/**
 * Write the metadata YAML file.
 *
 * @param {String} inputFile
 * @param {Object} metaData
 */
function writeMetaDataYaml (inputFile, metaData) {
  fs.writeFileSync(`${inputFile}.yml`, '---\n' + yaml.safeDump(metaData) + '\n')
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
 * @param {object} metaData
 *
 * @returns {object}
 */
function selectMetaData (metaData) {
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
 */
async function convert(inputFile) {
  const asset = makeAsset(inputFile)
  const inputExtension = asset.extension.toLowerCase()
  console.log(asset)
  let convert

  // audio
  if (['mp3', 'flac', 'm4a', 'wma', 'wav', 'aac'].includes(inputExtension)) {
    const metaData = await musicMetadata.parseFile(inputFile)
    if (metaData) {
      const result = selectMetaData(metaData)
      if (result) writeMetaDataYaml(inputFile, result)
    }
    const output = `${inputFile}.m4a`
    convert = childProcess.spawn('ffmpeg', [
      '-i', inputFile,
      '-c:a', 'libfdk_aac',
      '-profile:a', 'aac_he_v2', // https://trac.ffmpeg.org/wiki/Encode/AAC
      '-vn', // Disable video recording
      '-map_metadata', '-1', // remove metadata
      '-y', // Overwrite output files without asking
      output
    ])

  // image
  } else if (['jpg', 'jpeg', 'pgn', 'gif'].includes(inputExtension)) {
    const output = inputFile.replace(`.${asset.extension}`, '_preview.jpg')
    convert = childProcess.spawn('magick', [
      'convert',
      inputFile,
      '-resize', '1000x1000>', // http://www.imagemagick.org/Usage/resize/#shrink
      '-quality', '70', // https://imagemagick.org/script/command-line-options.php#quality
      output
    ])

  // videos
  } else if (['mpg', 'mp4'].includes(inputExtension)) {
    const output = `${inputFile}.mp4`
    convert = childProcess.spawn('ffmpeg', [
      '-i', inputFile,
      '-vcodec', 'libx264',
      '-profile:v', 'baseline',
      '-y', // Overwrite output files without asking
      output
    ])
  }

  if (convert) {
    convert.stdout.on('data', (data) => {
      console.log(chalk.green(data))
    })

    convert.stderr.on('data', (data) => {
      console.log(chalk.red(data))
    })

    convert.on('close', (code) => {
      console.log(`child process exited with code ${code}`);
    })
  }
}

commander
  .command('convert <input>').alias('c')
  .description('Convert media files in the appropriate format.')
  .action(convert)

commander
  .command('open').alias('o')
  .description('Open the base directory in a file browser.')
  .action(() => {
    const process = childProcess.spawn('xdg-open', [config.mediaServer.basePath], { detached: true })
    process.unref()
  })

commander
  .command('rename').alias('r')
  .description('Rename files, clean file names, remove all whitespaces and special characters.')
  .action(() => {
    function rename (oldPath) {
      console.log(`old: ${oldPath}`)
      const newPath = oldPath
        .replace(/[\(\)]/g, '')
        .replace(/[,.] /g, '_')
        .replace(/ +- +/g, '_')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/-*_-*/g, '_')
        .replace(/Ä/g, 'Ae')
        .replace(/ä/g, 'ae')
        .replace(/Ö/g, 'Oe')
        .replace(/ö/g, 'oe')
        .replace(/Ü/g, 'Ue')
        .replace(/ü/g, 'ue')
        .replace(/ß/g, 'ss')
      if (oldPath !== newPath) {
        console.log(`new: ${newPath}`)
        fs.renameSync(oldPath, newPath)
      }
    }
    walk(process.cwd(), {
      all (oldPath) {
        rename(oldPath)
      }
    })
  })

commander
  .command('yaml').alias('y')
  .description('Create info files in the YAML format in the current working directory.')
  .action(() => {
    function createYml (filePath) {
      const yamlFile = `${filePath}.yml`
      if (!fs.lstatSync(filePath).isDirectory() && !fs.existsSync(yamlFile)) {
        const asset = new Asset(filePath).addFileInfos()
        const title = asset.basename_
          .replace(/_/g, ', ')
          .replace(/-/g, ' ')
          .replace(/Ae/g, 'Ä')
          .replace(/ae/g, 'ä')
          .replace(/Oe/g, 'Ö')
          .replace(/oe/g, 'ö')
          .replace(/Ue/g, 'Ü')
          .replace(/ue/g, 'ü')
        const yamlMarkup = `---\n# path: ${asset.path}\n# filename: ${asset.filename}\n# extension: ${asset.extension}\ntitle: ${title}\nid: ${asset.basename_}\n`
        console.log(yamlMarkup)
        fs.writeFileSync(yamlFile, yamlMarkup)
      }
    }

    walk(process.cwd(), {
      asset (relPath) {
        createYml(relPath)
      }
    })
  })

commander
  .command('yaml-validate [input]').alias('yv')
  .description('Validate the yaml files.')
  .action((filePath) => {
    function validateYaml (filePath) {
      console.log(`Validate: ${chalk.yellow(filePath)}`)
      try {
        const result = yaml.safeLoad(fs.readFileSync(filePath, 'utf8'))
        console.log(chalk.green('ok!'))
        console.log(result)
      } catch (error) {
        console.log(`${chalk.red(error.name)}: ${error.message}`)
      }
    }

    if (filePath) {
      validateYaml(filePath)
    } else {
      walk(process.cwd(), {
        everyFile (relPath) {
          if (relPath.toLowerCase().indexOf('.yml') > -1) {
            validateYaml(relPath)
          }
        }
      })
    }
  })

  commander
  .command('presentation-template').alias('p')
  .description('Create a presentation template named “Presentation.baldr.yml”.')
  .action(() => {
    const filePath = path.join(process.cwd(), 'Presentation.baldr.yml')
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, templateBaldrYml)
    }
  })

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
