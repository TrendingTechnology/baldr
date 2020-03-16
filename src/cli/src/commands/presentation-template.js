// Node packages.
const childProcess = require('child_process')
const fs = require('fs')
const path = require('path')

// Third party packages.
const chalk = require('chalk')

// Project packages.
const mediaServer = require('@bldr/api-media-server')
const { convertTexToMd } = require('@bldr/core-browser')

const lib = require('../lib.js')

// Globals.
const { cwd } = require('../main.js')

function convert (content) {
  content = content.replace(/\n/g, ' ')
  content = content.replace(/\s\s+/g, ' ')
  content = content.trim()
  // [\\person{Erasmus von Rotterdam}
  content = content.replace(/^\[/, '')
  content = content.replace(/\]$/, '')
  return convertTexToMd(content)
}

function slidifyTexZitat (content) {
  const begin = '\\\\begin\\{zitat\\}\\*?(.*])?'
  const end = '\\\\end\\{zitat\\}'
  const regexp = new RegExp(begin + '([^]+?)' + end, 'g')
  const matches = content.matchAll(regexp)
  const slides = []
  for (const match of matches) {
    const optional = match[1]
    const text = convert(match[2])
    const slide = {
      quote: {
        text
      }
    }
    if (optional) {
      // [\person{Bischof Bernardino Cirillo}][1549]
      // [\person{Martin Luther}]
      const segments = optional.split('][')
      if (segments.length > 1) {
        slide.quote.author = convert(segments[0])
        slide.quote.date = convert(segments[1])
      } else {
        slide.quote.author = convert(segments[0])
      }
    }
    slides.push(slide)
  }
  return slides
}

/**
 * Create a Praesentation.baldr.yml file and insert all media assets in the
 * presentation.
 *
 * @param {String} filePath - The file path of the new created presentation
 *   template.
 */
async function presentationFromAssets (filePath) {
  let slides = []
  await mediaServer.walk(cwd, {
    asset (relPath) {
      const asset = lib.makeAsset(relPath)
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

  const worksheetPath = path.join(cwd, 'Arbeitsblatt.tex')
  if (fs.existsSync(worksheetPath)) {
    const worksheetContent = lib.readFile(worksheetPath)
    const quotes = slidifyTexZitat(worksheetContent)
    if (quotes.length > 0) {
      slides = slides.concat(quotes)
    }
  }

  const result = lib.yamlToTxt({
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
