#! /usr/bin/env node

// Node packages.
const childProcess = require('child_process')
const fs = require('fs')

// Third party packages.
const commander = require('commander')
const chalk = require('chalk')
const yaml = require('js-yaml')

// Project packages
const { Asset, walk } = require('./main.js')
const { utils } = require('@bldr/core')

// Project packages.
const config = utils.bootstrapConfig()

function makeAsset (mediaFile) {
  return new Asset(mediaFile).addFileInfos()
}

commander
  .version(require('./package.json').version)

commander
  .command('convert <input>').alias('c')
  .description('Convert media files in the appropriate format.')
  .action((input) => {
    const asset = makeAsset(input)
    const inputExtension = asset.extension.toLowerCase()
    console.log(asset)
    let convert
    if (['mp3', 'flac', 'm4a', 'wma', 'wav', 'aac'].includes(inputExtension)) {
      const output = `${input}.m4a`
      convert = childProcess.spawn('ffmpeg', [
        '-i', input,
        '-c:a', 'libfdk_aac',
        '-profile:a', 'aac_he_v2', // https://trac.ffmpeg.org/wiki/Encode/AAC
        '-vn', // Disable video recording
        '-map_metadata', '-1', // remove metadata
        '-y', // Overwrite output files without asking
        output
      ])
    } else if (['jpg', 'jpeg', 'pgn', 'gif'].includes(inputExtension)) {
      const output = input.replace(`.${asset.extension}`, '_preview.jpg')
      convert = childProcess.spawn('magick', [
        'convert',
        input,
        '-resize', '1000x1000>', // http://www.imagemagick.org/Usage/resize/#shrink
        '-quality', '70', // https://imagemagick.org/script/command-line-options.php#quality
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
  })

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
