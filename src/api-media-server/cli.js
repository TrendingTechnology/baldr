#! /usr/bin/env node

// Node packages.
const childProcess = require('child_process')
const fs = require('fs')

// Third party packages.
const commander = require('commander')

// Project packages
const { Asset, walk } = require('./index.js')

// console.log('Run git pull')
// const gitPull = childProcess.spawnSync('git', ['pull'], { cwd: this.basePath, encoding: 'utf-8' })
// console.log(gitPull.stderr)
// console.log(gitPull.stdout)
// if (gitPull.status !== 0) throw new Error(`git pull exits with an none zero status code.`)

commander
  .version(require('./package.json').version)

commander
  .command('open').alias('o')
  .description('Open the base directory in a file browser.')
  .action(() => {
    const process = childProcess.spawn('xdg-open', [config.basePath], { detached: true })
    process.unref()
  })

commander
  .command('rename').alias('r')
  .description('Rename files, clean file names, remove all whitespaces and special characters.')
  .action(() => {
    const cwd = process.cwd()
    const files = this.glob_(cwd)
    for (const oldPath of files) {
      console.log(oldPath)
      const newPath = oldPath
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
        console.log(newPath)
        fs.renameSync(oldPath, newPath)
      }
    }
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
