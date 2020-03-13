// Node packages.
const childProcess = require('child_process')
const fs = require('fs')
const path = require('path')

// Third party packages.
const chalk = require('chalk')

// Project packages.
const {
  walk
} = require('@bldr/api-media-server')
const {
  makeAsset,
  yamlToTxt
} = require('../lib.js')

// Globals.
const { cwd } = require('../main.js')

/**
 * Create a Praesentation.baldr.yml file and insert all media assets in the
 * presentation.
 *
 * @param {String} filePath - The file path of the new created presentation
 *   template.
 */
async function presentationFromAssets (filePath) {
  const slides = []
  await walk(cwd, {
    asset (relPath) {
      const asset = makeAsset(relPath)
      if (!asset.id) {
        console.log(`Asset has no ID: ${chalk.red(relPath)}`)
        return
      }
      let masterName
      if (asset.id.indexOf('Lueckentext') > -1) {
        masterName = 'cloze'
      } else if (asset.id.indexOf('NB') > -1) {
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

  const notePath = path.join(cwd, 'Hefteintrag.tex')
  if (fs.existsSync(notePath)) {
    const process = childProcess.spawnSync('detex', [notePath], { encoding: 'utf-8' })
    let note = process.stdout
    note = note.replace(/\n\n+/g, '')
    // Left over from \stueck*{}
    note = note.replace(/\*/g, '')
    // left over from tables
    note = note.replace(/&/g, '')
    slides.push({ note })
  }

  const result = yamlToTxt({
    slides
  })
  console.log(result)
  fs.writeFileSync(filePath, result)
}

async function action () {
  let filePath = path.join(cwd, 'Praesentation.baldr.yml')
  if (!fs.existsSync(filePath)) {
    console.log(`Presentation template created at: ${chalk.green(filePath)}`)
  } else {
    filePath = filePath.replace('.baldr.yml', '_tmp.baldr.yml')
    console.log(`Presentation already exists, create tmp file: ${chalk.red(filePath)}`)
  }

  await presentationFromAssets(filePath)
}

module.exports = action
