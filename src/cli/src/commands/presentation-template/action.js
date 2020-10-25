// Node packages.
const fs = require('fs')
const path = require('path')

// Third party packages.
const chalk = require('chalk')

// Project packages.
const mediaServer = require('@bldr/media-server')
const { convertTexToMd, removeTexComments, regBuilder, extractMatchAll } = require('@bldr/tex-markdown-converter')
const { readFile, yamlToTxt, makeAsset } = require('@bldr/media-manager')

// Globals.
const { cwd } = require('../../main.js')

function convertToOneLineMd (content) {
  content = removeTexComments(content)
  content = content.replace(/\n/g, ' ')
  content = content.replace(/\s\s+/g, ' ')
  content = content.trim()
  // [\\person{Erasmus von Rotterdam}
  content = content.replace(/^\[/, '')
  content = content.replace(/\]$/, '')
  return convertTexToMd(content)
}

/**
 * @param {String} masterName
 * @param {Array|Object} data
 */
function slidify (masterName, data, topLevelData) {
  function slidifySingle (masterName, data) {
    const slide = {}
    slide[masterName] = data
    if (topLevelData) Object.assign(slide, topLevelData)
    return slide
  }

  if (Array.isArray(data)) {
    const result = []
    for (const item of data) {
      result.push(slidifySingle(masterName, item))
    }
    return result
  } else if (typeof data === 'object') {
    return [slidifySingle(masterName, data)]
  }
}

function objectifyTexZitat (content) {
  const regexp = new RegExp(regBuilder.env('zitat', '\\*?' + regBuilder.captDotAll), 'g')
  const matches = content.matchAll(regexp)
  const data = []
  for (const match of matches) {
    let text = match[1]
    const regOpt = /^[^]+\]/
    let optional = text.match(regOpt)
    if (optional) {
      optional = optional[0]
      text = text.replace(regOpt, '')
    }
    text = convertToOneLineMd(text)
    const item = {
      text
    }
    if (optional) {
      // [\person{Bischof Bernardino Cirillo}][1549]
      // [\person{Martin Luther}]
      const segments = optional.split('][')
      if (segments.length > 1) {
        item.author = convertToOneLineMd(segments[0])
        item.date = convertToOneLineMd(segments[1])
      } else {
        item.author = convertToOneLineMd(segments[0])
      }
    }
    data.push(item)
  }
  return data
}

function objectifyTexItemize (content) {
  const regSection = regBuilder.cmd('(sub)?(sub)?section', '([^\\}]*?)')
  const regItemize = regBuilder.env('(compactitem|itemize)')

  const matches = []
  const exclude = ['itemize', 'compactitem', 'sub']
  for (const regex of [
    regSection + regBuilder.whiteNewline + regSection + regBuilder.whiteNewline + regItemize,
    regSection + regBuilder.whiteNewline + regItemize,
    regItemize
  ]) {
    content = extractMatchAll(content, regex, matches, exclude)
  }

  const data = []
  for (const match of matches) {
    const itemsText = match.pop()
    const sections = match
    const item = {}
    const items = []
    for (const itemText of itemsText.split('\\item')) {
      const oneLine = convertToOneLineMd(itemText)
      if (oneLine) items.push(oneLine)
    }

    if (sections.length) item.sections = sections
    item.items = items
    data.push(item)
  }
  return data
}

/**
 * Create a Praesentation.baldr.yml file and insert all media assets in the
 * presentation.
 *
 * @param {String} filePath - The file path of the new created presentation
 *   template.
 */
async function presentationFromAssets (filePath) {
  const basePath = path.dirname(filePath)
  let slides = []
  await mediaServer.walk({
    asset (relPath) {
      const asset = makeAsset(relPath)
      if (!asset.id) {
        console.log(`Asset has no ID: ${chalk.red(relPath)}`)
        return
      }
      let masterName
      if (asset.id.indexOf('_LT') > -1) {
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
  }, { path: basePath })

  const notePath = path.join(basePath, 'Hefteintrag.tex')
  if (fs.existsSync(notePath)) {
    const noteContent = readFile(notePath)
    slides = slides.concat(slidify('note', objectifyTexItemize(noteContent), { source: 'Hefteintrag.tex' }))
  }

  const worksheetPath = path.join(basePath, 'Arbeitsblatt.tex')
  if (fs.existsSync(worksheetPath)) {
    const worksheetContent = readFile(worksheetPath)
    slides = slides.concat(slidify('quote', objectifyTexZitat(worksheetContent), { source: 'Arbeitsblatt.tex' }))
  }

  const result = yamlToTxt({
    slides
  })
  console.log(result)
  fs.writeFileSync(filePath, result)
}

async function action (filePath, cmdObj) {
  if (!filePath) {
    filePath = cwd
  } else {
    const stat = fs.statSync(filePath)
    if (!stat.isDirectory()) {
      filePath = path.dirname(filePath)
    }
  }
  filePath = mediaServer.locationIndicator.getPresParentDir(filePath)

  filePath = path.resolve(path.join(filePath, 'Praesentation.baldr.yml'))
  console.log(filePath)
  if (!fs.existsSync(filePath) || cmdObj.force) {
    console.log(`Presentation template created at: ${chalk.green(filePath)}`)
  } else {
    filePath = filePath.replace('.baldr.yml', '_tmp.baldr.yml')
    console.log(`Presentation already exists, create tmp file: ${chalk.red(filePath)}`)
  }

  await presentationFromAssets(filePath)
}

module.exports = action
