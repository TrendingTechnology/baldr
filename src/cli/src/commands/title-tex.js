// Node packages.
const fs = require('fs')

// Project packages.
const mediaServer = require('@bldr/api-media-server')
const lib = require('../lib.js')
/**
 * ```tex
 * \setzetitel{
 *   jahrgangsstufe = {6},
 *   ebenei = {Musik und ihre Grundlagen},
 *   ebeneii = {Systeme und Strukturen},
 *   ebeneiii = {die Tongeschlechter Dur und Moll},
 *   titel = {Dur- und Moll-Tonleiter},
 *   untertitel = {Das Lied \emph{„Kol dodi“} in Moll und Dur},
 * }
 * ```
 *
 * @param {String} filePath - The path of a TeX file.
 */
function patchTexFileWithTitles (filePath) {
  console.log(filePath)
  const titles = new mediaServer.HierarchicalFolderTitles(filePath)

  const setzeTitle = {
    jahrgangsstufe: titles.grade
  }

  const ebenen = ['ebenei', 'ebeneii', 'ebeneiii', 'ebeneiv', 'ebenev']
  for (let index = 0; index < titles.curriculumTitlesArray.length; index++) {
    setzeTitle[ebenen[index]] = titles.curriculumTitlesArray[index]
  }
  setzeTitle.titel = titles.title
  if (titles.subtitle) {
    setzeTitle.untertitel = titles.subtitle
  }

  // Replace semantic markup
  for (const key in setzeTitle) {
    setzeTitle[key] = lib.semanticMarkupHtmlToTex(setzeTitle[key])
  }

  const lines = ['\\setzetitel{']
  for (const key in setzeTitle) {
    lines.push(`  ${key} = {${setzeTitle[key]}},`)
  }
  lines.push('}')
  lines.push('') // to get a empty line

  let texFileString = fs.readFileSync(filePath, { encoding: 'utf-8' })
  texFileString = texFileString.replace(
    /\\setzetitel\{.+?,?\n\}\n/s, // /s s (dotall) modifier, +? one or more (non-greedy)
    lines.join('\n')
  )
  fs.writeFileSync(filePath, texFileString)
}
/**
 *
 * @param {String} filePath
 */
function action (filePath) {
  mediaServer.walkDeluxe(patchTexFileWithTitles, new RegExp('.*\.tex$'), filePath)
}

module.exports = {
  command: 'title-tex [input]',
  alias: 'tt',
  description: 'Replace the title section of the TeX files with metadata retrieved from the title.txt files.',
  action
}
