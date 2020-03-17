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

function convertToOneLineMd (content) {
  content = content.replace(/\n/g, ' ')
  content = content.replace(/\s\s+/g, ' ')
  content = content.trim()
  // [\\person{Erasmus von Rotterdam}
  content = content.replace(/^\[/, '')
  content = content.replace(/\]$/, '')
  return convertTexToMd(content)
}

/**
 * @param {Array} slides
 * @param {String} masterName
 * @param {Array|Object} data
 */
function slidify (masterName, data) {
  function slidifySingle (masterName, data) {
    const slide = {}
    slide[masterName] = data
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
  const regexp = new RegExp(regTex.env('zitat', '\\*?' + regTex.captDotAll), 'g')
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

/**
 *
 * @param {*} match
 * @param {Array} excludeCaptureGroups - An array of capture group strings
 *   to exclude in the result matches for example regex:
 *   `(itemize|compactitem|sub)` -> `['itemize', 'compactitem', 'sub']`
 */
function cleanMatch (match, excludeCaptureGroups) {
  const exclude = excludeCaptureGroups
  // Convert to Array
  match = [...match]
  // Remove first (the complete match)
  match.shift()

  result = []
  for (const group of match) {
    if ((!exclude && group) || (exclude && group && !exclude.includes(group))) {
      result.push(group)
    }
  }
  return result
}

class RegTex {
  constructor () {
    this.dotAll =  '[^]+?'
    this.captDotAll = this.capt(this.dotAll)
    this.whiteNewline = '[\\s\n]*?'
  }

  capt (regex) {
    return `(${regex})`
  }

  cmd (macroName, regex) {
    return `\\\\${macroName}\\{${regex}\\}`
  }

  env (envName, regex) {
    if (!regex) regex = this.captDotAll
    return this.cmd('begin', envName) + regex + this.cmd('end', envName)
  }
}

const regTex = new RegTex()

/**
 * @param {String} text - Text to search for matches
 * @param {String} regexp - Regular expressed gets compiled
 * @param {Array} matches - Array gets filled with cleaned matches.
 * @param {Array} excludeCaptureGroups - An array of capture group strings
 *   to exclude in the result matches for example regex:
 *   `(itemize|compactitem|sub)` -> `['itemize', 'compactitem', 'sub']`
 *
 * @returns {String}
 */
function extractMatchAll (text, regexp, matches, excludeCaptureGroups) {
  regexp = new RegExp(regexp, 'g')
  if (text.match(regexp)) {
    const rawMatches = text.matchAll(regexp)
    for (let match of rawMatches) {
      text = text.replace(match[0], '')
      matches.push(cleanMatch(match, excludeCaptureGroups))
    }
    return text
  }
  return text
}

function objectifyTexItemize (content) {
  const regSection = regTex.cmd('(sub)?(sub)?section', '([^\\}]*?)')
  const regItemize = regTex.env('(compactitem|itemize)')

  const matches = []
  const exclude = ['itemize', 'compactitem', 'sub']
  for (const regex of [
    regSection + regTex.whiteNewline + regSection + regTex.whiteNewline + regItemize,
    regSection + regTex.whiteNewline + regItemize,
    regItemize
  ]) {
    content = extractMatchAll(content, regex, matches, exclude)
  }

  data = []
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
  }, { path: basePath })

  const notePath = path.join(basePath, 'Hefteintrag.tex')
  if (fs.existsSync(notePath)) {
    const noteContent = lib.readFile(notePath)
    slides = slides.concat(slidify('note', objectifyTexItemize(noteContent)))
  }

  const worksheetPath = path.join(basePath, 'Arbeitsblatt.tex')
  if (fs.existsSync(worksheetPath)) {
    const worksheetContent = lib.readFile(worksheetPath)
    slides = slides.concat(slidify('quote', objectifyTexZitat(worksheetContent)))
  }

  const result = lib.yamlToTxt({
    slides
  })
  console.log(result)
  fs.writeFileSync(filePath, result)
}

async function action (filePath) {
  if (!filePath) {
    filePath = cwd
  } else {
    const stat = fs.statSync(filePath)
    if (!stat.isDirectory()) {
      filePath = path.dirname(filePath)
    }
  }
  filePath = path.resolve(path.join(filePath, 'Praesentation.baldr.yml'))
  console.log(filePath)
  if (!fs.existsSync(filePath)) {
    console.log(`Presentation template created at: ${chalk.green(filePath)}`)
  } else {
    filePath = filePath.replace('.baldr.yml', '_tmp.baldr.yml')
    console.log(`Presentation already exists, create tmp file: ${chalk.red(filePath)}`)
  }

  await presentationFromAssets(filePath)
}

module.exports = action
